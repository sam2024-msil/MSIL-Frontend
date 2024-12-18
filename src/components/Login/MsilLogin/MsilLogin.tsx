import { Card } from 'react-bootstrap';

import microsoftLogo from '../../../assets/microsoft-logo.png';
import rightBgImage from '../../../assets/login-page-right-card-background.svg';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../../authconfig/authConfig";
import styles from './MsilLogin.module.scss';

const MsilLogin = () => {

    const { instance } = useMsal();
    
    const handleLogin = async (loginType: string) => {
        if (loginType === "popup") {
            instance.loginPopup(loginRequest);
        } else if (loginType === "redirect") {
            instance.loginRedirect(loginRequest);
        }
    }

    return (
        <div className={`${styles['login-right']}`}>
            <img src={rightBgImage} alt="" className={`${styles['login-right-bg-img']}`} />
            <div className={`d-flex h-auto ${styles['sso-login-card']}`}>
                <Card className="shadow-sm flex-grow-1">
                    <Card.Body className={`${styles['right-form']} text-center`}>
                        <h4 className={`${styles['msil-login-text']} fw-bold`}>MSIL Login</h4>
                        <div className={`${styles['sso-login-content']}`}>
                            <p className="text-muted">Single Sign on</p>
                            <div className={styles.login}>
                                <p>Sign in with your Identity provider </p>
                                <button type="button" className={styles.btnLogin} onClick={() => handleLogin("redirect")}>
                                    <img src={microsoftLogo} alt="microsoft icon" width={20} />
                                    <span>
                                        Sign in with Azure AD
                                    </span>
                                </button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default MsilLogin