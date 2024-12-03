import React from 'react';
import { Navbar } from 'react-bootstrap';
import styles from './Header.module.scss';
import headerLogo from '../../assets/MSIL-Logo.png';
import avatarimg from '../../assets/person_icon.svg';

const Header: React.FC = () => {
    return (
        <Navbar variant="dark" expand="lg" className={`${styles['navbarBg']}`}>
            <div className='container-fluid'>
                <Navbar.Brand href="" className='w-100'>
                    <div className='row'>
                        <div className='col-md-9'>
                            <div className={`${styles['headerLogo']}`}>
                                <img src={headerLogo} alt="header logo" />
                            </div>
                        </div>
                        <div className='col-md-3'>
                            <div className={`${styles['avatarProfileSection']} `}>
                                <img src={avatarimg} className={`${styles['avatarImg']}`} alt="Avatar image" />
                                <span className={`${styles['avatarText']}`}>John Doe</span>
                            </div>
                        </div>
                    </div>
                </Navbar.Brand>
            </div>
        </Navbar>
    );
};

export default Header;