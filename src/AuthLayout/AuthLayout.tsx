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
import menuIcon from '../assets/menu_icon.svg';


type Props = {
    children?: React.ReactNode;
};


export const AuthLayout: React.FC<Props> = ({ children }) => {

    const { instance, accounts } = useMsal();
    const navigate = useNavigate();
    const { showError } = useToast();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = isMobileDevice() || false;
    const [isVendorLoggedIn, setIsVendorLoggedIn] = useState<boolean>(false);

    const toggleMenuClose = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleMenuOpen = () => {
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

    useEffect(() => {
        setIsVendorLoggedIn(AppStateUtil.isVendorLoggedIn())
    },[])
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
                    showError(res?.data?.message);
                } else {
                    setIsVendorLoggedIn(true);
                    localStorage.setItem('IsVendoreLoggedIn','true');
                    localStorage.setItem('VendorAccessToken',res?.data?.token)
                    navigate("/chat");
                }
            }
        }).catch((e) => {
            showError(e?.response?.data?.detail);
            setIsVendorLoggedIn(false);
            console.error(e);
        })
    }

    const vendorLoggedOut = () => {
        setIsVendorLoggedIn(false);
    }
    return (
        <>
            {/* <UnauthenticatedTemplate>
            {(!isVendorLoggedIn) && 
                <Login vendorLogin={vendorLoginHandler} />
            }
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate> */}

                <Container fluid>
                    <Row>
                        <Col xs={isMobile ? 12 : 1} className={`p-0 ${styles.sideMenuSection} ${isMenuOpen ? styles.menuOpen : styles.menuClosed}`}>
                            <SideMenu isMobile={isMobile} isMenuOpen={isMenuOpen} toggleMenu={toggleMenuClose} />
                        </Col>
                        <Col xs={isMobile ? 12 : 11} className={`p-0 ${styles.rightSection} ${isMenuOpen ? styles.menuClosed : styles.menuOpen} ${isVendorLoggedIn ? 'start-0 w-100' : ''}`}>
                            <div className={`${styles['right-content']} ${(isVendorLoggedIn) ? 'ms-0' : ''}`}>
                            <button className={`mt-3 me-3 btn ${styles.menuToggleButton}`} onClick={toggleMenuOpen} >
                                <img src={menuIcon} alt="menuToggleIcon" className={styles.menuToggleIcon} />
                            </button>
                                <Header vendorLoggedOut={vendorLoggedOut} />
                                {children}
                            </div>
                        </Col>
                    </Row>
                </Container>

            {/* </AuthenticatedTemplate> */}

            {(isVendorLoggedIn) && 
            <Container fluid>
                <Row>
                <Col xs={12} className={`p-0 ${isMenuOpen ? styles.menuClosed : styles.menuOpen}`}>
                    <div className={`${styles['vendor-authrozed-content']}`}>
                        <Header vendorLoggedOut={vendorLoggedOut} />
                        {children}
                    </div>
                </Col>
                </Row>
            </Container>    
            }
        </>
    );
};

export default AuthLayout;