import React from 'react';
import { Table } from 'react-bootstrap';
import searchIcon from '../assets/search.png';
import styles from './Table.module.scss';

const TableComponent: React.FC = () => {
    return (
        <>
            <div className='row mb-3'>
                <div className='col-md-9'>
                    <div className={`${styles['search-section']}`}>
                        <form>
                            {/* <div className="input-group">
                <input className="form-control border-end-0 border" type="search" placeholder="Search" id="example-search-input" />
                  <span className="input-group-append">
                    <button className="btn ms-n5" type="button">
                      <img src={searchIcon} alt="searchIcon" className={`${styles['searchIcon']}`} />
                    </button>
                  </span>
              </div> */}

                            <div className={styles.formGroup}>
                                <span className={`${styles.formControlFeedback}`}>
                                    <img src={searchIcon} alt="searchIcon" className={`${styles['searchIcon']}`} />
                                </span>
                                <input type="text" className={`form-control ${styles.formControl}`} placeholder="Search" />
                            </div>

                        </form>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className={`${styles['upload-button']}`}>
                        <button type='button' className='btn btn-primary btn-md'>
                            Upload
                        </button>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-12'>
                    <div className={`${styles['table-section']}`}>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Username</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>John</td>
                                    <td>Doe</td>
                                    <td>@johndoe</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Jane</td>
                                    <td>Smith</td>
                                    <td>@janesmith</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TableComponent;