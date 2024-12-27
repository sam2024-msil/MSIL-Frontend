import { TOKEN_EXPIRED, USER_MESSAGES } from "../constants/AuthConstants";

const APP_AUTH_TOKEN = 'msilAppToken';
const USER_ROLE = 'role';

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

    static isVendorLoggedIn(): boolean {
        try {
            if (typeof localStorage !== 'undefined') {
                const value = localStorage.getItem('IsVendoreLoggedIn');
                return value === 'true';
            }
        } catch (e) {
            return false
        }
        return false;
    }

    static getVendorAuthToken(): string {
        try {
            if (typeof localStorage !== 'undefined') {
                const value: any = localStorage.getItem('VendorAccessToken');
                return value;
            }
        } catch (e) {
            return ''
        }
        return '';
    }

    static storeUserRoleDetails(role:string) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(USER_ROLE, role);
        }
    }

    static getRoleDetails(): number {
        try {
            if (typeof localStorage !== 'undefined') {
                const value: any = localStorage.getItem(USER_ROLE);
                return parseInt(value, 10);
            }
        } catch (e) {
            return 0
        }
        return 0;
    }

    static removeRoleDetails() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(USER_ROLE);
            }
        } catch (e) {
            return USER_MESSAGES.something_wrong;
        }
    }
}

export default AppStateUtil;