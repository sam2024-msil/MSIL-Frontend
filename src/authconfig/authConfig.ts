import { Configuration, LogLevel, PopupRequest } from "@azure/msal-browser";

const clentId: any = import.meta.env.VITE_APP_AZURE_AD_MSAL_CLIENT_ID;
const tenantId = import.meta.env.VITE_APP_AZURE_AD_MSAL_TENANT_ID;

const msalConfig: Configuration = {
    auth: {
        clientId: clentId, // This is your application (client) ID  
        authority: `https://login.microsoftonline.com/${tenantId}`, // Replace with your tenant ID  
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
    },
    system: {
        allowNativeBroker: false,
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                    case LogLevel.Verbose:
                    case LogLevel.Warning:
                    default:
                        return;
                }
            }
        }
    }
};

export const loginRequest:PopupRequest = {
    scopes: [`api://${clentId}/access_as_user`, 'offline_access']
};

export default msalConfig;  
