import { loginRequest } from '../authconfig/authConfig';
import { msalInstance } from '../main';
import AppStateUtil from "./AppStateUtil";

export const getAccessToken = () => (AppStateUtil.isVendorLoggedIn()) ? AppStateUtil.getVendorAuthToken() : AppStateUtil.getAuthToken();

const handleLogout = () => {
  AppStateUtil.removeAuthToken();
  msalInstance.logoutRedirect();
}

export const refreshToken = async (): Promise<string | null> => {

  try {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      console.error("No active account found");
      handleLogout();
      return null;
    }

    const silentRequest = {
      account: accounts[0],
      scopes: loginRequest.scopes,
    };

    const response: any = await msalInstance.acquireTokenSilent(silentRequest);
    return response?.idToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    msalInstance.loginRedirect(loginRequest);
    return null;
  }
};