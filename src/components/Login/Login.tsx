import { Row, Col } from 'react-bootstrap';
import styles from './Login.module.scss'
import MSILLogo from '../../assets/MSIL-Logo.png'
import vendorGPTLogo from '../../assets/vendorGPT-Logo.svg';
import VendoreLogin from './VendorLogin/VendorLogin';
import MsilLogin from './MsilLogin/MsilLogin';


interface LoginPropTypes {
    vendorLogin: (userName: string, password: string) => void;
}
 
const Login = ({ vendorLogin }:LoginPropTypes) => {



    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-white overflow-hidden">
            <div className={`${styles.header} d-flex justify-content-between align-items-center w-100 px-4 mb-4`}>
                <img src={MSILLogo} width={500} alt="Maruti Suzuki Logo" />
                <div style={{ width: "150px" }}></div>
            </div>

            {/* Login Section */}
            <Row className="w-100 justify-content-center">
                {/* Vendor Login Card */}
                <Col md={5}>
                    <VendoreLogin vendorLogin={vendorLogin} />
                </Col>

                {/* Divider */}
                <Col md={2}>

                    <div className="d-flex justify-content-center align-items-center mt-3">
                        <img
                            src={vendorGPTLogo}
                            alt="Vendor GPT Logo"
                            style={{ width: "70%" }}
                        />
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <div className={`${styles['vertical-divider']}`}>
                            <span className={styles['divider-text']}>OR</span>
                        </div>
                    </div>
                </Col>

                {/* Msil Login Card */}
                <Col md={5}>
                    <MsilLogin />
                </Col>
            </Row>
        </div>

    )
}
export default Login;