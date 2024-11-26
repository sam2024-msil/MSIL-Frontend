import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import styles from './Login.module.scss'
import MSILLogo from '../../assets/MSIL-Logo.png'
import vendorGPTLogo from '../../assets/vendorGPT-Logo.svg';
import microsoftLogo from '../../assets/microsoft-logo.png';
const Login = () => {

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-white">
            {/* <div className={styles['logo-container']}> */}
            <div className={`${styles.header} d-flex justify-content-between align-items-center w-100 px-4 mb-4`}>
                <img src={MSILLogo} width={500} alt="Maruti Suzuki Logo" />
                <div style={{ width: "150px" }}></div> {/* Placeholder for symmetry */}
            </div>



            {/* Login Section */}
            <Row className="w-100 justify-content-center">
                {/* Left Login Card */}
                <Col md={5}>
                    <div className={`d-flex h-auto ${styles['login-card']} w-75 ms-auto`}>
                        <Card className={`shadow-sm flex-grow-1`}>
                            <Card.Body className={`${styles['left-form']}`}>
                                <Form>
                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            defaultValue="John@maruti.com"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            defaultValue="********"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formCheckbox">
                                        <Form.Check type="checkbox" label="Remember Me" defaultChecked />
                                    </Form.Group>
                                    <Button type="submit" className={`${styles['login-btn']} w-100`}>
                                        LOGIN
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>

                {/* Divider */}
                <Col md={2}>

                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <img
                            src={vendorGPTLogo} // Replace with Vendor GPT logo
                            alt="Vendor GPT Logo"
                            style={{ width: "40%" }}
                        />
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className={`${styles['vertical-divider']}`}>
                            <span className={styles['divider-text']}>OR</span>
                        </div>
                    </div>
                </Col>

                {/* Right Login Card */}
                <Col md={5}>
                    <div className={`d-flex h-auto ${styles['sso-login-card']} w-75 me-auto`}>
                        <Card className="shadow-sm flex-grow-1">
                            <Card.Body className={`${styles['right-form']} text-center`}>
                                <h4 className={`${styles['msil-login-text']} fw-bold`}>MSIL Login</h4>
                                <div className={`${styles['sso-login-content']}`}>
                                    <p className="text-muted">Single Sign on</p>
                                    <div className={styles.login}>
                                        <p>Sign in with your Identity provider </p>
                                        <button type="button" className={styles.btnLogin}>
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
                </Col>
            </Row>
        </div>

    )
}
export default Login;