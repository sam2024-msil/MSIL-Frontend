import React, { useState, useEffect } from 'react';
import { Nav, OverlayTrigger, Popover } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './SideMenu.module.scss';
import ListingIcon from '../../assets/SideMenuIcons/listing_icon.svg';
import ListingIconActive from '../../assets/SideMenuIcons/listing-active.svg';
import chatIcon from '../../assets/SideMenuIcons/chat_icon.svg';
import crossIcon from '../../assets/close_icon.svg';
import chatIconActive from '../../assets/SideMenuIcons/chat-active.svg';
import moduleIcon from '../../assets/SideMenuIcons/module_icon.svg';
import moduleIconActive from '../../assets/SideMenuIcons/module-active.svg';
import userManagementIcon from '../../assets/SideMenuIcons/user_management_icon.svg';
import userManagementIconActive from '../../assets/SideMenuIcons/user_management-active.svg';
import logoutIcon from '../../assets/SideMenuIcons/logout_icon.svg';
import logoutIconActive from '../../assets/SideMenuIcons/logout-active.svg';
import AppStateUtil from '../../utils/AppStateUtil';
import { useMsal } from "@azure/msal-react";

const SideMenu: React.FC<{ isMobile: boolean; isMenuOpen: boolean; toggleMenu: () => void }> = ({ isMobile, isMenuOpen, toggleMenu }) => {


  const navigate = useNavigate();
  const location = useLocation();
  const { instance } = useMsal();
  const [activeKey, setActiveKey] = useState<string>(location.pathname);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [showPopover, setShowPopover] = useState<{ [key: string]: boolean }>({
    listing: false,
    chat: false,
    module: false,
    userManagement: false,
    logout: false
  });

  useEffect(() => {
    setActiveKey(location.pathname);
  }, [location.pathname]);

  const handleSelect = (selectedKey: string | null) => {
    if (selectedKey) {
      setActiveKey(selectedKey); // Set the active key to the selected menu item
      setHoverKey(null); // Reset hover key when an item is selected
      navigate(selectedKey); // Navigate to the selected key
      if (isMenuOpen) {
        toggleMenu();
      }
 
    }
  };

  const handleMouseEnter = (key: string) => {
    if (key !== activeKey) {
      setHoverKey(key);
      setShowPopover((prev) => ({ ...prev, [key]: true }));
    }
  };

  const handleMouseLeave = (key: string) => {
    setHoverKey(null);
    setShowPopover((prev) => ({ ...prev, [key]: false }));
  };

  const renderTooltip = (message: string) => (
    <Popover id="popover-basic" className={styles["popoverCustom"]}>
      <Popover.Body>
        <div className={styles["popover-content"]}>
          {message}
        </div>
      </Popover.Body>
    </Popover>
  );

  const getIcon = (key: string, defaultIcon: string, activeIcon: string) => {
    return activeKey === key || hoverKey === key ? activeIcon : defaultIcon;
  };

  const handleLogout = (logoutType: string) => {

    if (logoutType === "redirect") {
        AppStateUtil.removeAuthToken();
        instance.logoutRedirect();
    }
}

  return (
    <div className={styles.sideMenuContainer}>
    <Nav
      defaultActiveKey="/listing"
      activeKey={activeKey}
      onSelect={handleSelect}
      className={`${styles['sideMenu-bg']} flex-column vh-100 px-0`}
    >
      {isMobile && isMenuOpen && (
          <button onClick={toggleMenu} className={`${styles.closeMenuButton} btn`}>
            <img src={crossIcon} alt="closeMenuIcon" className={styles.closeMenuIcon} />
          </button>
        )}
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="right"
        show={showPopover.listing}
        overlay={activeKey !== '/listing' ? renderTooltip('Listing') : <></>}
      >
        <Nav.Link
          eventKey="/document-management"
          onClick={() => handleSelect('/document-management')}
          onMouseEnter={() => handleMouseEnter('listing')}
          onMouseLeave={() => handleMouseLeave('listing')}
          className={`${styles['side-menu-item']} ${activeKey === '/document-management' ? styles['active'] : ''}`}
        >
          <img src={getIcon('/document-management', ListingIcon, ListingIconActive)} alt="Listing Icon" className={`${styles['side-menu-icon']}`} />
          <img src={ListingIconActive} alt="ListingIconActive" className={`${styles['side-menu-icon-active']}`} />
          <span className={styles['side-menu-text']}>Listing</span>
        </Nav.Link>
      </OverlayTrigger>
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="right"
        show={showPopover.chat}
        overlay={activeKey !== '/chat' ? renderTooltip('Chat') : <></>}
      >
        <Nav.Link
          eventKey="/chat"
          onClick={() => handleSelect('/chat')}
          onMouseEnter={() => handleMouseEnter('chat')}
          onMouseLeave={() => handleMouseLeave('chat')}
          className={`${styles['side-menu-item']} ${activeKey === '/chat' ? styles['active'] : ''}`}
        >
          <img src={getIcon('/chat', chatIcon, chatIconActive)} alt="Chat Icon" className={`${styles['side-menu-icon']}`} />
          <img src={chatIconActive} alt="chatIconActive" className={`${styles['side-menu-icon-active']}`} />
          <span className={styles['side-menu-text']}>Chat</span>
        </Nav.Link>
      </OverlayTrigger>

      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="right"
        show={showPopover.module}
        overlay={activeKey !== '/module-management' ? renderTooltip('Module') : <></>}
      >
        <Nav.Link
          eventKey="/module-management"
          onClick={() => handleSelect('/module-management')}
          onMouseEnter={() => handleMouseEnter('module')}
          onMouseLeave={() => handleMouseLeave('module')}
          className={`${styles['side-menu-item']} ${activeKey === '/module-management' ? styles['active'] : ''}`}
        >
          <img src={getIcon('/module-management', moduleIcon, moduleIconActive)} alt="Module Icon" className={`${styles['side-menu-icon']}`} />
          <img src={moduleIconActive} alt="moduleIconActive" className={`${styles['side-menu-icon-active']}`} />
          <span className={styles['side-menu-text']}>Module</span>
        </Nav.Link>
      </OverlayTrigger>

      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="right"
        show={showPopover.userManagement}
        overlay={activeKey !== '/user-management' ? renderTooltip('User Management') : <></>}
      >
        <Nav.Link
          eventKey="/user-management"
          onClick={() => handleSelect('/user-management')}
          onMouseEnter={() => handleMouseEnter('userManagement')}
          onMouseLeave={() => handleMouseLeave('userManagement')}
          className={`${styles['side-menu-item']} ${activeKey === '/user-management' ? styles['active'] : ''}`}
        >
          <img src={getIcon('/user-management', userManagementIcon, userManagementIconActive)} alt="User Management Icon" className={`${styles['side-menu-icon']}`} />
          <img src={userManagementIconActive} alt="userManagementIconActive" className={`${styles['side-menu-icon-active']}`} />
          <span className={styles['side-menu-text']}>User Management</span>
        </Nav.Link>
      </OverlayTrigger>

      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="right"
        show={showPopover.logout}
        overlay={activeKey !== '/' ? renderTooltip('Logout') : <></>}
      >
        <Nav.Link
          eventKey="/"
          onClick={() => handleLogout('redirect')}
          onMouseEnter={() => handleMouseEnter('logout')}
          onMouseLeave={() => handleMouseLeave('logout')}
          className={`${styles['side-menu-item']} ${activeKey === '/logout' ? styles['active'] : ''}`}
        >
          <img src={getIcon('/logout', logoutIcon, logoutIconActive)} alt="Logout Icon" className={`${styles['side-menu-icon']}`} />
          <img src={logoutIconActive} alt="logoutIconActive" className={`${styles['side-menu-icon-active']}`} />
          <span className={styles['side-menu-text']}>Logout</span>
        </Nav.Link>
      </OverlayTrigger>

    </Nav>
    </div>
  );
};

export default SideMenu;