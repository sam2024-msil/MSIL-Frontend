import React, { useCallback, useMemo, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "../../shared/ReactDatepicker.scss";
import styles from './DocumentListing.module.scss'
import SideMenu from '../SideMenus/SideMenu';
import Header from '../Header/Header';
import eyeIcon from '../../assets/icon-eye.svg';
import searchIcon from '../../assets/search_icon.svg';
import uploadIcon from '../../assets/upload_icon.svg';
import deleteIcon from '../../assets/delete-icon.svg';
import CalendarIcon from '../../assets/calendarIcon.svg';
import DataTable from '../../shared/Rtable';
import axiosInstance from '../../api/axios';
import UploadModal from './UploadModal';
import AppStateUtil from '../../utils/AppStateUtil';


interface DataItem {
    id: number;
    name: string;
}

const DocumentListing: React.FC = () => {

    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [triggerTableApi, setTriggerTableApi] = useState<number>(0);
    const [dateRange, setDateRange] = useState<any>([null, null]);
    const [startDate, endDate] = dateRange;

    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const columns: any = useMemo(
        () => [
            {
                Header: 'Document Name',
                accessor: 'doc_name',
                disableSortBy: true,
            },
            {
                Header: 'Upload By',
                accessor: 'uploaded_by',
                disableSortBy: true,
            },
            {
                Header: 'Date & Time',
                Cell: ({ row }: any) => {
                    return (
                        <span>
                            {row?.values.uploaded_dateTime}
                        </span>
                    )
                },
                accessor: 'uploaded_dateTime',
                sortType: (rowA: any, rowB: any) => {
                    const a = new Date(rowA.values.dob);
                    const b = new Date(rowB.values.dob);
                    return a > b ? 1 : a < b ? -1 : 0;
                }
            },
            {
                Header: 'Module',
                accessor: 'doc_category',
                sortType: (rowA: any, rowB: any) => {
                    const a = new Date(rowA.values.dob);
                    const b = new Date(rowB.values.dob);
                    return a > b ? 1 : a < b ? -1 : 0;
                }
            },
            {
                Header: 'Status',
                // Cell: ({ row }: any) => {
                //     return (
                //         <span>
                //             {row}
                //         </span>
                //     );
                // },
                sortType: 'basic',
                disableSortBy: false,
                accessor:'doc_status'
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
                disableSortBy: true,
            }
        ],
        []
    );
    const handleEdit = (id:any) => {

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
            const response = await axiosInstance.get(`/listOfDocs?${queryParams.toString()}&sort_by=doc_status`);
            const data = response.data;
            console.log(" data :: ", data)
            setShowLoader(false);
            return {
                rows: data.data,
                totalPages: 0,
                totalRecords: data.data.length
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
                    <h5>Document Listing</h5>
                </div>
                <div className='row mb-3'>
                    <div className='col-md-9'>
                        <div className='d-flex'>
                            <div className={`${styles['search-section']}`}>
                                <div className={styles.formGroup}>
                                    <span className={`${styles.formControlFeedback}`}>
                                        <img src={searchIcon} alt="searchIcon" className={`${styles['searchIcon']}`} />
                                    </span>
                                    <input type="text" className={`form-control ${styles.formControl}`} placeholder="Search" />
                                </div>
                            </div>
                            <div className={`input-group ms-3 ${styles.datePickerContainer}`}>
                                <DatePicker
                                    className={`form-control ${styles.datePickerBorder} w-100`}
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => {
                                        setDateRange(update);
                                    }}
                                />
                                <div className="input-group-append">
                                    <span className={styles.inputGroupText}>
                                        <img src={CalendarIcon} className={styles.calendarIcon} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className={`${styles['upload-button']}`}>
                            <button type='button' className='btn btn-primary btn-md' onClick={handleShow}>
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
            <UploadModal show={showModal} handleClose={handleClose} />
        </>
    );
};

export default DocumentListing;