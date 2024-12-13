import { TOKEN_EXPIRED, USER_MESSAGES } from "../constants/AuthConstants";

const APP_AUTH_TOKEN = 'msilAppToken';

class AppStateUtil {

    static storeAuthToken(token: string) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(APP_AUTH_TOKEN, token);
        }
    }

    static getAuthToken() {
        try {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem(APP_AUTH_TOKEN);
            }
        } catch (e) {
            return TOKEN_EXPIRED.expired;
        }
    }

    static removeAuthToken() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(APP_AUTH_TOKEN);
            }
        } catch (e) {
            return USER_MESSAGES.something_wrong;
        }
    }

    static isVendorLoggedIn() {
        try {
            if(typeof localStorage !== 'undefined') {
                localStorage.getItem('')
            }
        } catch(e) {
            return false
        }
    }
}

export default AppStateUtil;