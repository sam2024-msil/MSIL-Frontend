import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './UserList.module.scss'
import SideMenu from '../SideMenus/SideMenu';
import Header from '../Header/Header';
import TableComponent from '../../shared/Tabel';

const UserList: React.FC = () => {
  return (
    <div>
      
      <Container fluid>
        <Row>
          <Col xs={1} className='p-0'>
            <SideMenu />
          </Col>
          <Col xs={11} className='p-0'>

            <Header />
            <div className={`${styles['right-content-section']}`}>
                <div className={`${styles['right-main-heading']}`}>
                    <h5>Listing</h5>
                </div>
                <TableComponent />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserList;