import React, { useCallback, useMemo, useState } from 'react';
import styles from './moduleList.module.scss';
import editIcon from '../../assets/edit-icon.svg';
import searchIcon from '../../assets/search_icon.svg';
import deleteIcon from '../../assets/delete-icon.svg';
import DataTable from '../../shared/Rtable';
import axiosInstance from '../../api/axios';
import UploadModuleModal from './UploadModuleModal';
import DeleteConfimationModal from './DeleteConfirmationModal';
import { useToast } from '../../context/ToastContext';


interface DataItem {
  id: number;
  name: string;
}

interface moduleDetails {
  ModuleName: string;
  ModuleID: number;
}
const ModuleList: React.FC = () => {

  const { showSuccess, showError } = useToast();
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [triggerTableApi, setTriggerTableApi] = useState<number>(0);
  const [moduleIdForEdit, setModuleIdForEdit] = useState<number>(0);
  const [moduleNameForEdit, setModuleNameForEdit] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [moduleDeleteId, setModuleDeleteId] = useState<number>(0)

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setModuleIdForEdit(0)
    setModuleNameForEdit('');
    setTriggerTableApi(triggerTableApi + 1);
  }
  console.log(showLoader)
  const columns: any = useMemo(
    () => [
      {
        Header: 'Module Name',
        accessor: 'ModuleName',
        disableSortBy: true,
      },
      {
        Header: 'Created On',
        Cell: ({ row }: any) => {
          return (
            <span>
              {row?.values.CreatedOn}
            </span>
          )
        },
        accessor: 'CreatedOn',
        disableSortBy: true,
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
          >
            <img src={editIcon} onClick={() => handleEdit(row.original)} />
            <img src={deleteIcon} onClick={() => { setShowDeleteModal(true); setModuleDeleteId(row.original.ModuleID)}} /> 
          </button>
        ),
        accessor: '',
        disableSortBy: true,
      }
    ],
    []
  );

  const handleEdit = (moduleDetails:moduleDetails) => {
    setModuleIdForEdit(moduleDetails.ModuleID);
    setModuleNameForEdit(moduleDetails.ModuleName);
    setShowModal(true);
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
      const response = await axiosInstance.get(`/modules/`);
      const data = response.data;
      setShowLoader(false);
      return {
        rows: data,
        totalPages: 1,
        totalRecords: data.length
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

  const closeConfirmModal = (decision:string) => {
    if(decision == 'proceed') {
      axiosInstance.delete(`/modules/${moduleDeleteId}`)
      .then((res) => {
        if(res) {
          showSuccess('Module deleted successfully');
          setShowDeleteModal(false);
          setTriggerTableApi(triggerTableApi + 1);
        }
      }).catch((e) => {
        console.error(e)
        showError('Something went wrong')
      })
    } else {
      setShowDeleteModal(false);
    }
  }
  return (
    <>

      <div className={`${styles['right-content-section']}`}>
        <div className={`${styles['right-main-heading']}`}>
          <h5>Module</h5>
        </div>
        <div className='row mb-3'>
          <div className='col-md-9'>
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
          <div className='col-md-3'>
            <div className={`${styles['upload-button']}`}>
              <button type='button' className='btn btn-primary btn-md' onClick={handleShow}>
                Add Module
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
      <UploadModuleModal show={showModal} handleClose={handleClose} moduleId={moduleIdForEdit} moduleNameForEdit={moduleNameForEdit} />
      <DeleteConfimationModal show={showDeleteModal} onClose={closeConfirmModal}/>
    </>
  );
};

export default ModuleList;