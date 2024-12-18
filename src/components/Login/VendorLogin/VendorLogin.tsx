import { Card, Button, Form } from 'react-bootstrap';
import styles from './Vendor.module.scss';
import leftBgImage from '../../../assets/login-page-left-card-background.svg';
import { useState } from 'react';

interface VendorLoginPropTypes {
    vendorLogin: (userName: string, password: string) => void;
}

const VendoreLogin = ({ vendorLogin }:VendorLoginPropTypes) => {

    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [userNameerr, setUserNameerr] = useState<string>('');
    const [isFormValid, setIsFormValid] = useState<boolean>(false);

    const loginHandler = () => {
        vendorLogin(userName,password)
    }

    const handleChange = (e: any) => {
        const { value } = e.target;

        if (!value.trim()) {
            setUserNameerr('Username is required');
            setIsFormValid(false)
          } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                setIsFormValid(false);
                setUserNameerr('Invalid email format. Please include "@" in the email address.');
            } else {
                setUserNameerr('');
                if(password) {
                    setIsFormValid(true);
                } else {
                    setIsFormValid(false);
                }
            }
          }
          setUserName(value);
      };
    return (
        <div className={`${styles['login-left']}`}>
            <img src={leftBgImage} alt="" className={`${styles['login-left-bg-img']}`} />
            <div className={`d-flex h-auto ${styles['login-card']}`}>
                <Card className={`shadow-sm flex-grow-1`}>
                    <Card.Body className={`${styles['left-form']}`}>
                        <h4 className={`${styles['msil-login-text']} fw-bold text-center`}>Vendor Login</h4>
                        <Form>
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter email"
                                    onChange={(e) => handleChange(e)}
                                    isInvalid={(userNameerr !=='') ? true : false}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {userNameerr}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) => {
                                        if(e.target.value.trim() !=='') {
                                            if(userNameerr ==='' && userName !=='') {
                                                setIsFormValid(true);
                                            } else {
                                                setIsFormValid(false);
                                            }
                                        } else {
                                            setIsFormValid(false);
                                        }
                                        setPassword(e.target.value);
                                    }
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formCheckbox">
                                <Form.Check type="checkbox" label="Remember Me" defaultChecked />
                            </Form.Group>
                            <Button type="submit" className={`${styles['login-btn']} w-100 text-center`} disabled={!isFormValid ? true : false} onClick={(e) => {loginHandler(); e.preventDefault()}}>
                                LOGIN
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default VendoreLogin;