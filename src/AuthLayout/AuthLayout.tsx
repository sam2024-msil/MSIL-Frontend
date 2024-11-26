import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { loginRequest } from "../authconfig/authConfig";
import Login from "../components/Login/Login";


type Props = {
    children?: React.ReactNode;
};


export const AuthLayout: React.FC<Props> = ({ children }) => {

    const { instance, accounts } = useMsal();
    const navigate = useNavigate();
    const location = useLocation();

    const [showLoader, setShowLoader] = useState<boolean>(false);

    useEffect(() => {
        if (instance && accounts.length > 0) {
            instance.handleRedirectPromise().then(handleResponse).catch((e) => {
                console.error("Error handling redirect promise: ", e);
            });
        }
    }, [instance, accounts]);

    useEffect(() => {
        if (accounts.length > 0 && (location.pathname !== 'project-list' && location.pathname !== '/chat' && location.pathname !== '/summary')) {
            navigate("/project-list");
        }
    }, [])

    const getAccessToken = async (): Promise<void> => {
        const account = accounts[0];

        try {
            const response = await instance.acquireTokenSilent({
                account: account,
                scopes: loginRequest.scopes,
            });
            //navigateToProjectList()
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
            {/* {(showLoader) && <Loader />} */}
                {/* <Header /> */}
                {children}
            </AuthenticatedTemplate>
        </>
    );
};

export default AuthLayout;