import React, { useCallback, useMemo, useState } from 'react';
import styles from './UserList.module.scss';
import eyeIcon from '../../assets/icon-eye.svg';
import searchIcon from '../../assets/search_icon.svg';
// import uploadIcon from '../../assets/upload_icon.svg';
// import deleteIcon from '../../assets/delete-icon.svg';
import DataTable from '../../shared/Rtable';
import axiosInstance from '../../api/axios';
import AddUserModal from './AddUserModal';
import AddVendorModal from './AddVendorModal';

interface DataItem {
  id: number;
  name: string;
}

const Listing: React.FC = () => {

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [triggerTableApi, setTriggerTableApi] = useState<number>(0);

  const [showUserModal, setUserShowModal] = useState(false);
  const [showVendorModal, setVendorShowModal] = useState(false);

  const handleUserShow = () => setUserShowModal(true);
  const handleUserClose = () => setUserShowModal(false);

  const handleVendorShow = () => setVendorShowModal(true);
  const handleVendorClose = () => {
    setVendorShowModal(false);
    setTriggerTableApi(triggerTableApi + 1);
  }
  console.log(showLoader);
  const columns: any = useMemo(
    () => [
      {
        Header: 'User Id',
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
        accessor: 'userId',
        disableSortBy: true,
      },
      {
        Header: 'Username',
        accessor: 'userName',
        disableSortBy: true,
      },
      {
        Header: 'First Name',
        accessor: 'firstName',
        disableSortBy: true,
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',

      },
      {
        Header: 'Created On',
        Cell: ({ row }: any) => {
          return (
            <span>
              {row?.values.created_on}
            </span>
          )
        },
        accessor: 'created_on',
        disableSortBy: true,
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
        Header: 'Action',
        Cell: ({ row }: any) => (
          <button
            className={styles.editButton}
            title='Edit Project'
            onClick={() => handleEdit(row.value)}
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

  const handleEdit = (id:string) => {
    console.log(id);
  }

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
    catch (error: any) {
      setShowLoader(false); // Ensure the loader is hidden on error  
      if (error.response) {
        console.error('Error:', error.response.data);
      }

    }
    return { rows: [], totalPages: 0, totalRecords: 0 };
  }, []);

  return (
    <>
      <div className={`${styles['right-content-section']}`}>
        <div className={`${styles['right-main-heading']}`}>
          <h5>User Mangement</h5>
        </div>
        {/* <TableComponent /> */}
        <div className='row mb-3'>
          <div className='col-md-7'>
            <div className={`${styles['search-section']}`}>
              <form>

                <div className={styles.formGroup}>
                  <span className={`${styles.formControlFeedback}`}>
                    <img src={searchIcon} alt="searchIcon" className={`${styles['searchIcon']}`} />
                  </span>
                  <input type="text" className={`form-control ${styles.formControl}`} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="Search" />
                </div>

              </form>
            </div>
          </div>
          <div className='col-md-5'>
            <div className={`${styles['upload-button']}`}>
              <button type='button' className='btn btn-primary btn-md' onClick={handleUserShow}>
                Add New User
              </button>
              <button type='button' className='btn btn-primary btn-md ms-2' onClick={handleVendorShow}>
                Add New Vendor
              </button>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <div className={`${styles['table-section']}`}>
              <DataTable columns={columns} tableType={'userList'} fetchData={fetchData} searchString={searchKeyword} triggerTableApi={triggerTableApi} startDate={''} endDate={''} />
            </div>
          </div>
        </div>
      </div>
      <AddUserModal show={showUserModal} handleClose={handleUserClose} />
      <AddVendorModal show={showVendorModal} handleClose={handleVendorClose} />
    </>
  );
};

export default Listing;