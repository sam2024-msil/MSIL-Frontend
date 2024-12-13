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

    const loginHandler = () => {
        vendorLogin(userName,password)
    }

    return (
        <div className={`${styles['login-left']}`}>
            <img src={leftBgImage} alt="" className={`${styles['login-left-bg-img']}`} />
            <div className={`d-flex h-auto ${styles['login-card']} w-75 ms-auto`}>
                <Card className={`shadow-sm flex-grow-1`}>
                    <Card.Body className={`${styles['left-form']}`}>
                        <h4 className={`${styles['msil-login-text']} fw-bold text-center`}>Vendor Login</h4>
                        <Form>
                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    required
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formCheckbox">
                                <Form.Check type="checkbox" label="Remember Me" defaultChecked />
                            </Form.Group>
                            <Button type="submit" className={`${styles['login-btn']} w-100 text-center`} onClick={(e) => {loginHandler(); e.preventDefault()}}>
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