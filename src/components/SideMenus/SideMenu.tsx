import React from 'react';
import { Nav } from 'react-bootstrap';
import styles from './SideMenu.module.scss';

const SideMenu: React.FC = () => {
    return (
        <Nav defaultActiveKey="/home" className={`${styles['sideMenu-bg']} flex-column vh-100 ps-0`}>
            <Nav.Link href="/home" className={`${styles['side-menu-item']} ${styles['active']} p-2`}> Home</Nav.Link>
            <Nav.Link href="/settings" className={`${styles['side-menu-item']} p-2`}>Settings</Nav.Link>
        </Nav>
    );
};

export default SideMenu;