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
import Loader from "../components/Spinner/Spinner";


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
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loggedUserRole, setLoggedUserRole] = useState<number>(0);

    const toggleMenuClose = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = (logoutType: string) => {

        if (logoutType === "redirect") {
            AppStateUtil.removeAuthToken();
            instance.logoutRedirect();
        }
    }

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
        setIsVendorLoggedIn(AppStateUtil.isVendorLoggedIn());
        setLoggedUserRole(AppStateUtil.getRoleDetails());
    },[])

    useEffect(() => {
        if (loggedUserRole === 1 && location.pathname === '/') {
            navigate("/document-management");
        } else if((loggedUserRole === 2 || loggedUserRole === 3) && location.pathname === '/'){
            navigate("/chat");
        }
    }, [loggedUserRole])

    const getAccessToken = async (): Promise<void> => {
        const account = accounts[0];

        try {
            const response = await instance.acquireTokenSilent({
                account: account,
                scopes: loginRequest.scopes,
            });
            getAuthRoleToken(response.idToken);
        } catch (error) {
            console.error("Error acquiring token:", error);
        }
    };

    const getAuthRoleToken = async (accessToken: string): Promise<void> => {
        setShowLoader(true);
        axiosInstance.get(`/authentication`, {
            headers: {
                'authentication': `${accessToken}`
            }
        }).then((response) => {
            setShowLoader(false);
            if (response.data && response?.data?.code === 200) {
                const roleToken = response?.data?.token;
                setLoggedUserRole(parseInt(response?.data?.role, 10))
                AppStateUtil.storeAuthToken(roleToken);
                AppStateUtil.storeUserRoleDetails(response?.data?.role)
                setIsAuthorized(true);
                navigateuInToApp(parseInt(response?.data?.role, 10));
            } else if(response?.data?.code === 404) {
                setIsAuthorized(false);
                showError(response?.data?.message);
                setTimeout(() => {
                    handleLogout('redirect');
                },10000) //10 seconds
            }
        }).catch((e) => {
            console.log(e);
            showError(e?.response?.data?.detail);
            setShowLoader(false);
        })
    }

    const navigateuInToApp = (role:number) => {
        setShowLoader(true);
        setTimeout(() => {
            if (
                AppStateUtil.getAuthToken() !== undefined &&
                AppStateUtil.getAuthToken() !== "Token Expired"
            ) {
                setShowLoader(false);
                if(role === 1) {
                    navigate("/document-management");
                } else {
                    navigate("/chat");
                }
            }
        }, 200);
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
                    AppStateUtil.storeUserRoleDetails('3')
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
    console.log(" isAuthorized :: ", isAuthorized)
    return (
        <>
            <UnauthenticatedTemplate>
            {(!isVendorLoggedIn) && 
                <Login vendorLogin={vendorLoginHandler} />
            }
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
            {(showLoader) && <Loader />}
            {(loggedUserRole === 1) &&
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
            }

            {(loggedUserRole === 2) && // Msil Users Auth pages
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
            </AuthenticatedTemplate>

            {(isVendorLoggedIn) &&  // Vwndor Users Auth pages
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