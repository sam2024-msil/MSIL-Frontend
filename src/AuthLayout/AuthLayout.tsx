import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from "../authconfig/authConfig";
import Login from "../components/Login/Login";
import SideMenu from "../components/SideMenus/SideMenu";
import Header from "../components/Header/Header";
import styles from './AuthLayout.module.scss';
import AppStateUtil from "../utils/AppStateUtil";


type Props = {
    children?: React.ReactNode;
};


export const AuthLayout: React.FC<Props> = ({ children }) => {

    const { instance, accounts } = useMsal();
    const navigate = useNavigate();

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

    return (
        <>
            <UnauthenticatedTemplate>
                <Login />
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>

                <Container fluid>
                    <Row>
                        <Col xs={1} className='p-0'>
                            <SideMenu />
                        </Col>
                        <Col xs={11} className='p-0'>
                            <div className={`${styles['right-content']}`}>
                                <Header />
                                {children}
                            </div>
                        </Col>
                    </Row>
                </Container>

            </AuthenticatedTemplate>
        </>
    );
};

export default AuthLayout;