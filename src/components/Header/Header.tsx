import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Navbar } from 'react-bootstrap';
import styles from './Header.module.scss';
import { useMsal, useAccount } from "@azure/msal-react";
import headerLogo from '../../assets/MSIL-Logo.png';
import avatarimg from '../../assets/person_icon.svg';
import vendorLogo from '../../assets/vendorGPT-Logo.svg';
import AppStateUtil from '../../utils/AppStateUtil';
import headerLogoIcon from '../../assets/MSIL-Header-Icon.png';


interface HeaderPropTypes {
    vendorLoggedOut: () => void;
}

const Header = ({ vendorLoggedOut }:HeaderPropTypes) => {

    const navigate = useNavigate();
    const { accounts, instance } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [isVendorLoggedIn, setIsVendorLoggedIn] = useState<boolean>(false);
    const [vendorAuthToken, setVendorAuthToken] = useState<any>('');
    const [name, setName] = useState("");
    const [loggedInUserRole, setLoggedInUserRole] = useState<number>(0);

    useEffect(() => {
        setIsVendorLoggedIn(AppStateUtil.isVendorLoggedIn());
        setLoggedInUserRole(AppStateUtil.getRoleDetails());
    },[])

    useEffect(() => {
        if(isVendorLoggedIn) {
            setVendorAuthToken(jwtDecode(AppStateUtil.getVendorAuthToken()));
        } else {
            setVendorAuthToken('');
        }
    },[isVendorLoggedIn])

    useEffect(() => {
        if (account && account.name) {
            setName(account.name.split(" ")[0]);
        } else {
            setName("");
        }
    }, [account]);
    
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .dropdown-toggle::after {
                content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-chevron-down' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708'/%3E%3C/svg%3E") !important;
                display: inline-block;
                border: none;
                vertical-align: middle;
            }
        `;
        document.head.appendChild(style);
    }, []);
    
    const handleLogout = (logoutType: string) => {

        if (logoutType === "redirect") {
            AppStateUtil.removeAuthToken();
            instance.logoutRedirect();
        }
    }

    const vendorLogout = () => {
        localStorage.clear();
        if(loggedInUserRole === 3) {
            vendorLoggedOut();
            navigate('/');
        } else {
            handleLogout('redirect');
        }
    }
    
    return (
        <Navbar variant="dark" expand="lg" className={`${styles['navbarBg']}`}>
            <div className='container-fluid'>
                <div className='navbar-brand w-100'>
                    <div className='row'>
                        <div className='col-9'>
                            <div className={isVendorLoggedIn ? `${styles['header-logo-section']}` : ''}>
                            <div className={`${styles['headerLogo']}`}>
                                <img src={headerLogo} alt="header logo" className={`${styles.headerLogoDesktop}`}/>
                                <img src={headerLogoIcon} alt="header logo" className={`${styles.headerLogoMobile}`}/>
                            </div>
                            {(isVendorLoggedIn) && 
                                <div className={`${styles['header-vendor-logo']}`}>
                                    <img src={vendorLogo} alt='Vendor Logo' />
                                </div>
                            }
                            </div>
                        </div>
                        <div className='col-3'>
                            {(isVendorLoggedIn || loggedInUserRole === 2) ? 
                            <div className='dropdown'>
                                <div className={`${styles['avatarProfileSection']}`}>
                                    <div className={`${styles.avatarDropdown} dropdown-toggle`} id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={avatarimg} className={`${styles['avatarImg']}`} alt="Avatar image" />
                                        <span className={`${styles['avatarText']}`}>
                                            {(isVendorLoggedIn) ? vendorAuthToken?.userId : (loggedInUserRole===2) ? name : 'John Doe'}
                                        </span>
                                    </div>
                                    {(isVendorLoggedIn || loggedInUserRole === 2) &&
                                    <ul className={`${styles['avatar-dropdown-menu']} dropdown-menu end-0`} aria-labelledby="dropdownMenuButton1">
                                        <li onClick={vendorLogout}><a className="dropdown-item">Logout</a></li>
                                    </ul>
                                    }
                                </div>
                            </div>
                                :
                            
                                <div className={`${styles['avatarProfileSection']}`}>
                                    <img src={avatarimg} className={`${styles['avatarImg']}`} alt="Avatar image" />
                                    <span className={`${styles['avatarText']}`}>
                                        {(isVendorLoggedIn) ? vendorAuthToken?.userId : name}
                                    </span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Navbar>
    );
};
 
export default Header;