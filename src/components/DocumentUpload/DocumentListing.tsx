import React, { useCallback, useMemo, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './DocumentListing.module.scss'
import SideMenu from '../SideMenus/SideMenu';
import Header from '../Header/Header';
import TableComponent from '../../shared/Tabel';
import eyeIcon from '../../assets/icon-eye.svg';
import searchIcon from '../../assets/search_icon.svg';
import uploadIcon from '../../assets/upload_icon.svg';
import deleteIcon from '../../assets/delete-icon.svg';
import DataTable from '../../shared/Rtable';
import axiosInstance from '../../api/axios';


interface DataItem {
    id: number;
    name: string;
}

const DocumentListing: React.FC = () => {

    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [triggerTableApi, setTriggerTableApi] = useState<number>(0);
    
    const columns: any = useMemo(
        () => [
          {
            Header: 'Document Name',
            Cell: ({ row }: any) => {
              return (
                <span
                  className={styles.documentName}
                //   onClick={() => gotoProject(row)}
                >
                  {row?.values.name}
                </span>
              )
            },
            accessor: 'name',
          },
          {
            Header: 'Upload By',
            accessor: 'description',
          },
          {
            Header: 'Date & Time',
            Cell: ({ row }: any) => {
              return (
                <span>
                  {row?.values.created_on}
                </span>
              )
            },
            accessor: 'created_on',
            sortType: (rowA: any, rowB: any) => {
              const a = new Date(rowA.values.dob);
              const b = new Date(rowB.values.dob);
              return a > b ? 1 : a < b ? -1 : 0;
            }
          },
          {
            Header: 'Module',
            accessor: 'module',
            sortType: (rowA: any, rowB: any) => {
              const a = new Date(rowA.values.dob);
              const b = new Date(rowB.values.dob);
              return a > b ? 1 : a < b ? -1 : 0;
            }
          },
          {
            Header: 'Status',  
            Cell: ({ row }: any) => {  
                return (  
                    <span>  
                        {row}
                    </span>  
                );  
            },  
            disableSortBy: true,  
    
          },
          {
            Header: 'Action',
            Cell: ({ row }: any) => (
              <button
                className={styles.editButton}
                title='Edit Project'
              >
                <img src={eyeIcon} />
              </button>
            ),
            accessor: '',
            disableSortBy: true,
          }
        ],
        []
      );
      const fetchData = useCallback(async ({ pageIndex, pageSize, sortBy, searchString }: {
        pageIndex: number;
        pageSize: number;
        sortBy: { id: string; desc: boolean }[];
        searchString: string;
      }): Promise<{ rows: DataItem[]; totalPages: number; totalRecords: number }> => {
        setShowLoader(true);
        const queryParams = new URLSearchParams();
        queryParams.append('page', (pageIndex + 1).toString());
        queryParams.append('page_size', pageSize.toString());
        if (sortBy.length > 0 && sortBy[0].id) {
          queryParams.append('sort_by', sortBy[0].id || '');
          queryParams.append('sort_order', sortBy[0].desc ? 'desc' : 'asc');
        }
        if (searchString) queryParams.append('search', searchString);
    //     if (startDate && endDate) {
    //       queryParams.append('from_date', DateUtil.formatDateToISO(startDate));
    //       queryParams.append('to_date', DateUtil.formatDateToISO(endDate));
    //   }
        try {
          // const response = await axiosInstance.get(`/project/ListProjects/?page=${pageIndex + 1}&page_size=${pageSize}${sortParam}${searchParam}${dateParam}`);
          const response = await axiosInstance.get(`/project/ListProjects/?${queryParams.toString()}`);  
            const data = response.data;  
            setShowLoader(false);  
            return {  
                rows: data.projects,  
                totalPages: data.pages,  
                totalRecords: data.total  
            }; 
        }
        catch (error:any){
            setShowLoader(false); // Ensure the loader is hidden on error  
            if (error.response) {    
                console.error('Error:', error.response.data);  
            }  
        
        }
        return { rows: [], totalPages: 0, totalRecords: 0 };
      }, []);
    return (
    <div>

      <Container fluid>
        <Row>
          <Col xs={1} className='p-0'>
            <SideMenu />
          </Col>
          <Col xs={11} className='p-0'>
            <div className={`${styles['right-content']}`}>
              <Header />
              <div className={`${styles['right-content-section']}`}>
                <div className={`${styles['right-main-heading']}`}>
                  <h5>Document Listing</h5>
                </div>
                {/* <TableComponent /> */}
                {/* <DataTable columns={columns} fetchData={fetchData} searchString={searchKeyword} triggerTableApi={triggerTableApi} startDate={''} endDate={''} /> */}
                <div className='row mb-3'>
        <div className='col-md-9'>
          <div className={`${styles['search-section']}`}>
            <form>

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
              <span className='me-2'><img src={uploadIcon} alt="" className={`${styles['upload-icon']}`} ></img></span>Upload
            </button>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-12'>
          <div className={`${styles['table-section']}`}>
          <DataTable columns={columns} fetchData={fetchData} searchString={searchKeyword} triggerTableApi={triggerTableApi} startDate={''} endDate={''} />
          </div>
        </div>
      </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DocumentListing;