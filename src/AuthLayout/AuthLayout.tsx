import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from "../authconfig/authConfig";
import Login from "../components/Login/Login";
import SideMenu from "../components/SideMenus/SideMenu";
import Header from "../components/Header/Header";
import styles from './AuthLayout.module.scss';
import AppStateUtil from "../utils/AppStateUtil";
import { isMobileDevice } from "../utils/BroswerUtil";
import { useToast } from '../context/ToastContext';
import axiosInstance from "../api/axios";


type Props = {
    children?: React.ReactNode;
};


export const AuthLayout: React.FC<Props> = ({ children }) => {

    const { instance, accounts } = useMsal();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = isMobileDevice() || false;
    const [isVendorLoggedIn, setIsVendorLoggedIn] = useState<boolean>(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {

        const checkAuth = async () => {
            try {
                const response = await instance.handleRedirectPromise();
                if (response) {
                    await handleResponse(response);
                } else if (accounts.length > 0) {
                    //await getAccessToken(); // Get token silently for logged-in users
                }
            } catch (error) {
                console.error("Error handling redirect promise:", error);
            }
        };

        checkAuth();
    }, [instance, accounts]);

    const getAccessToken = async (): Promise<void> => {
        const account = accounts[0];

        try {
            const response = await instance.acquireTokenSilent({
                account: account,
                scopes: loginRequest.scopes,
            });
            AppStateUtil.storeAuthToken(response.idToken)
            navigate("/document-management");
        } catch (error) {
            console.error("Error acquiring token:", error);
        }
    };


    const handleResponse = async (response: any) => {

        if (response) {
            await getAccessToken();
        }
    };
    
    const vendorLoginHandler = (useName:string,password:string) => {
        axiosInstance.post(`/login`,{userId:useName,userPassword:password})
        .then((res) => {
            if(res) {
                if(res?.data?.code === 400) {
                    showError('Invalid login credentials!');
                } else {
                    setIsVendorLoggedIn(true);
                    localStorage.setItem('IsVendoreLoggedIn','true');
                    localStorage.setItem('VendorAccessToken',res?.data?.tocken)
                    navigate("/chat");
                }
            }
        }).catch((e) => {
            setIsVendorLoggedIn(false);
            console.error(e);
        })
    }

    return (
        <>
            <UnauthenticatedTemplate>
            {(!isVendorLoggedIn) && 
                <Login vendorLogin={vendorLoginHandler} />
            }
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>

                <Container fluid>
                    <Row>
                        <Col xs={isMobile ? 12 : 1} className={`p-0 ${styles.sideMenuSection} ${isMenuOpen ? styles.menuOpen : styles.menuClosed}`}>
                            <SideMenu isMobile={isMobile} isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
                        </Col>
                        <Col xs={isMobile ? 12 : 11} className={`p-0 ${styles.rightSection} ${isMenuOpen ? styles.menuClosed : styles.menuOpen}`}>
                            <div className={`${styles['right-content']}`}>
                                <Header />
                                {children}
                            </div>
                        </Col>
                    </Row>
                </Container>

            </AuthenticatedTemplate>

            {(isVendorLoggedIn) && 
            <>
            <Container fluid>
                <Row>
                <Col xs={12} className={`p-0 ${isMenuOpen ? styles.menuClosed : styles.menuOpen}`}>
                    <div className={`${styles['vendor-authrozed-content']}`}>
                        <Header />
                        {children}
                    </div>
                </Col>
                </Row>
                </Container>    
            </>
            }
        </>
    );
};

export default AuthLayout;