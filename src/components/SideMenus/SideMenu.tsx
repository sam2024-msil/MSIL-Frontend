import React, { useState } from 'react';
import { Nav, OverlayTrigger, Popover } from 'react-bootstrap';
import styles from './SideMenu.module.scss';
import ListingIconActive from '../../assets/SideMenuIcons/listing-active.svg';
// import ListingIcon from '../../assets/sidemenu_icon/listing_icon.svg';
// import CahtIconActive from '../../assets/sidemenu_icon/chat-active.svg';
import chatIcon from '../../assets/SideMenuIcons/chat_icon.svg';
import moduleIcon from '../../assets/SideMenuIcons/module_icon.svg';
import userManagementIcon from '../../assets/SideMenuIcons/user_management_icon.svg';
import logoutIcon from '../../assets/SideMenuIcons/logout_icon.svg';

const SideMenu: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('/listing');
  const [showPopover, setShowPopover] = useState<{ [key: string]: boolean }>({
    listing: false,
    chat: false,
    module: false,
    userManagement: false,
    logout: false
  });

  const handleSelect = (selectedKey: string | null) => {
    if (selectedKey) {
      setActiveKey(selectedKey);
    }
  };

  const handleMouseEnter = (key: string) => {
    if (key !== activeKey) {
      setShowPopover((prev) => ({ ...prev, [key]: true }));
    }
  };

  const handleMouseLeave = (key: string) => {
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

  return (
    <Nav
      defaultActiveKey="/listing"
      activeKey={activeKey}
      onSelect={handleSelect}
      className={`${styles['sideMenu-bg']} flex-column vh-100 px-0`}
    >
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="right"
        show={showPopover.listing}
        overlay={activeKey !== '/listing' ? renderTooltip('Listing') : <></>}
      >
        <Nav.Link
          href="/listing"
          eventKey="/listing"
          onMouseEnter={() => handleMouseEnter('listing')}
          onMouseLeave={() => handleMouseLeave('listing')}
          className={`${styles['side-menu-item']} ${activeKey === '/listing' ? styles['active'] : ''}`}
        >
          <img src={ListingIconActive} alt="Listing Icon" className={`${styles['side-menu-icon']}`} />
        </Nav.Link>
      </OverlayTrigger>
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="right"
        show={showPopover.chat}
        overlay={activeKey !== '/chat' ? renderTooltip('Chat') : <></>}
      >
        <Nav.Link
          href="/chat"
          eventKey="/chat"
          onMouseEnter={() => handleMouseEnter('chat')}
          onMouseLeave={() => handleMouseLeave('chat')}
          className={`${styles['side-menu-item']} ${activeKey === '/chat' ? styles['active'] : ''}`}
        >
          <img src={chatIcon} alt="Chat Icon" className={`${styles['side-menu-icon']}`} />
        </Nav.Link>
      </OverlayTrigger>

      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="right"
        show={showPopover.module}
        overlay={activeKey !== '/module' ? renderTooltip('Module') : <></>}
      >
        <Nav.Link
          href="/module"
          eventKey="/module"
          onMouseEnter={() => handleMouseEnter('module')}
          onMouseLeave={() => handleMouseLeave('module')}
          className={`${styles['side-menu-item']} ${activeKey === '/module' ? styles['active'] : ''}`}
        >
          <img src={moduleIcon} alt="Module Icon" className={`${styles['side-menu-icon']}`} />
        </Nav.Link>
      </OverlayTrigger>

      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="right"
        show={showPopover.userManagement}
        overlay={activeKey !== '/userManagement' ? renderTooltip('User Management') : <></>}
      >
        <Nav.Link
          href="/userManagement" 
          eventKey="/userManagement"
          onMouseEnter={() => handleMouseEnter('userManagement')}
          onMouseLeave={() => handleMouseLeave('userManagement')}
          className={`${styles['side-menu-item']} ${activeKey === '/userManagement' ? styles['active'] : ''}`}
        >
          <img src={userManagementIcon} alt="User Management Icon" className={`${styles['side-menu-icon']}`} />
        </Nav.Link>
      </OverlayTrigger>

      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement="right"
        show={showPopover.logout}
        overlay={activeKey !== '/logout' ? renderTooltip('Logout') : <></>}
      >
        <Nav.Link
          href="/logout" 
          eventKey="/logout"
          onMouseEnter={() => handleMouseEnter('logout')}
          onMouseLeave={() => handleMouseLeave('logout')}
          className={`${styles['side-menu-item']} ${activeKey === '/logout' ? styles['active'] : ''}`}
        >
          <img src={logoutIcon} alt="User Management Icon" className={`${styles['side-menu-icon']}`} />
        </Nav.Link>
      </OverlayTrigger>

    </Nav>
  );
};

export default SideMenu;