import { Configuration, LogLevel, PopupRequest } from "@azure/msal-browser";

const clentId: any = import.meta.env.VITE_APP_AZURE_AD_MSAL_CLIENT_ID;
const tenantId = import.meta.env.VITE_APP_AZURE_AD_MSAL_TENANT_ID;

const msalConfig: Configuration = {
    auth: {
        clientId: 'de7a898d-8fd8-498b-b2f5-99be6be6cb07', // This is your application (client) ID  
        authority: `https://login.microsoftonline.com/d78a8218-4135-4026-a3a8-1cdd7223b4d5`, // Replace with your tenant ID  
        redirectUri: 'http://localhost:5173/',
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
    // scopes: [`api://d78a8218-4135-4026-a3a8-1cdd7223b4d5/access_as_user`, 'offline_access']
    scopes: ["User.ReadBasic.All","Mail.Read"]
};

export default msalConfig;  
