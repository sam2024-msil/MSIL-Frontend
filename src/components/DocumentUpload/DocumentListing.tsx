import React, { useCallback, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import "../../shared/ReactDatepicker.scss";
import styles from './DocumentListing.module.scss'
import eyeIcon from '../../assets/icon-eye.svg';
import searchIcon from '../../assets/search_icon.svg';
import uploadIcon from '../../assets/upload_icon.svg';
import deleteIcon from '../../assets/delete-icon.svg';
// import menuIcon from '../../assets/menu_icon.svg';
import editIcon from '../../assets/edit-icon.svg';
import CalendarIcon from '../../assets/calendarIcon.svg';
import DataTable from '../../shared/Rtable';
import axiosInstance from '../../api/axios';
import UploadModal from './UploadModal';
import DateUtil from '../../utils/DateUtil';
import { useToast } from '../../context/ToastContext';
import DeleteConfimationModal from '../../shared/DeleteConfirmationModal/DeleteConfirmationModal';
import PdfViewer from '../../shared/PDFViewer/PdfViewer';
import { FileStatus } from '../../enums/FileProcessStatus';
import Loader from '../Spinner/Spinner';


interface DataItem {
    id: number;
    name: string;
}

const DocumentListing: React.FC = () => {

    const { showSuccess, showError } = useToast();
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [triggerTableApi, setTriggerTableApi] = useState<number>(0);
    const [dateRange, setDateRange] = useState<any>([null, null]);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [docDeleteId, setDocDeleteId] = useState<number>(0);
    const [editData, setEditData] = useState<any>({});
    const [showPDFModal, setShowPDFModal] = useState<boolean>(false);
    const [pdfLink, setPdfLink] = useState<string>('');
    const [startDate, endDate] = dateRange;

    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        setEditData({});
        setTriggerTableApi(triggerTableApi + 1);
    }
    

    const downloadPDF = async (rowData:any) => {
        try {
            setShowLoader(true);
            const response = await axiosInstance.get(`/download?doc_id=${rowData?.doc_id}`, {
              responseType: 'blob',
            });
            const fileBlob = new Blob([response.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(fileBlob);
            link.setAttribute('download', rowData?.doc_name);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setShowLoader(false);
          } catch (error) {
            setShowLoader(false);
            console.error('Error downloading file:', error);
          }
      
    }

    const columns: any = useMemo(
        () => [
            {
                Header: 'Document Name',
                Cell: ({ row }: any) => {
                    return (
                      <span
                        className={styles.docName}
                        onClick={() => downloadPDF(row?.original)}
                      >
                        {row?.values.doc_name}
                      </span>
                    )
                  },
                accessor: 'doc_name',
                disableSortBy: true,
            },
            {
                Header: 'Uploaded by',
                accessor: 'uploaded_by',
                disableSortBy: true,
            },
            {
                Header: 'Date & Time',
                Cell: ({ row }: any) => {
                    return (
                        <span>
                            {DateUtil.convertToIST(row?.values.uploaded_dateTime)}
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
                Cell: ({ row }: any) => {
                    let colurCode = (row?.values?.doc_status.toLowerCase() === FileStatus.failed)
                    ? 'rgb(244,67,54)':
                    (row?.values?.doc_status.toLowerCase() === FileStatus.uploaded)
                    ? 'rgb(249,167,37)':
                    (row?.values?.doc_status.toLowerCase() === FileStatus.processing)
                    ? 'rgb(0,150,136)':
                    (row?.values?.doc_status.toLowerCase() === FileStatus.processed)
                    ? 'rgb(48,63,160)'
                    : 'rgb(0,200,81)';
                    return (
                        <span className={styles[row?.values?.doc_status.toLowerCase()]} style={{color:colurCode}}>
                            {row?.values?.doc_status}
                        </span>
                    );
                },
                sortType: 'basic',
                disableSortBy: false,
                accessor:'doc_status'
            },
            {
                Header: 'Action',
                Cell: ({ row }: any) => (
                    <button>
                        <img src={editIcon} title='Edit Document' alt='Edit Icon' onClick={() => handleEdit(row?.original)} />
                        <img src={eyeIcon} title='Preview Document' alt='Preview Icon' onClick={() => viewPdf(row?.original)} />
                        <img src={deleteIcon} title='Delete Document' alt='Delete Icon' onClick={() => { setShowDeleteModal(true); setDocDeleteId(row.original.doc_id)}} /> 
                    </button>
                ),
                disableSortBy: true,
            }
        ],
        []
    );

    const viewPdf = (pdfParam:any) => {
        setShowLoader(true);
        axiosInstance.get(`/view-document?doc_id=${pdfParam?.doc_id}`)
        .then((res) => {
            if(res) {
                setShowPDFModal(true);
                setPdfLink(res?.data?.sas_url);
                setShowLoader(false);
            }
        }).catch((e) => {
            console.error(e)
            setShowLoader(false);
        })
    }
    const handleEdit = (rowData:any) => {
        setShowModal(true);
        setEditData(rowData);
    }
    const fetchData = useCallback(async ({ pageIndex, pageSize, sortBy, searchString,  startDate, endDate }: {
        pageIndex: number;
        pageSize: number;
        sortBy: { id: string; desc: boolean }[];
        searchString: string;
        startDate?: string;
        endDate?: string;
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
        if (startDate && endDate) {
            queryParams.append('from_date', DateUtil.formatDateToISO(startDate));
            queryParams.append('to_date', DateUtil.formatDateToISO(endDate));
        }
        try {
            const response = await axiosInstance.get(`/listOfDocs?${queryParams.toString()}`, {
                timeout: 200000,
              });
            const data = response.data;
            setShowLoader(false);
            return {
                rows: data.data,
                totalPages: data.pages,
                totalRecords: data.total_records
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
          setShowLoader(true);
          axiosInstance.post(`/delet-doc?doc_id=${docDeleteId}`)
          .then((res) => {
            if(res) {
              setShowLoader(false);
              showSuccess('Document deleted successfully');
              setShowDeleteModal(false);
              setTriggerTableApi(triggerTableApi + 1);
            }
          }).catch((e) => {
            setShowLoader(false);
            console.error(e)
            showError('Something went wrong');
          })
        } else {
          setShowDeleteModal(false);
        }
    }

    return (
        <>
            {showLoader && <Loader />}
            <div className={`${styles['right-content-section']}`}>
            <div className={`${styles['right-main-heading']}`}>
                <h5>Document Listing</h5>
            </div>
                <div className='row mb-3'>
                    <div className='col-md-9 col-sm-12'>
                        <div className={`${styles.searchContainer}`}>   
                            <div className={`${styles['search-section']}`}>
                                <div className={styles.formGroup}>
                                    <span className={`${styles.formControlFeedback}`}>
                                        <img src={searchIcon} alt="searchIcon" className={`${styles['searchIcon']}`} />
                                    </span>
                                    <input type="text" className={`form-control ${styles.formControl}`} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="Search" />
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
                        <div>
                            <DataTable columns={columns} tableType={'documentList'} fetchData={fetchData} searchString={searchKeyword} triggerTableApi={triggerTableApi} startDate={startDate} endDate={endDate}  />
                        </div>
                    </div>
                </div>
            </div>
            <UploadModal show={showModal} handleClose={handleClose} editData={editData} />
            <DeleteConfimationModal show={showDeleteModal} onClose={closeConfirmModal} />
            <PdfViewer showModal={showPDFModal} setShowModal={setShowPDFModal} srcLink={pdfLink} />
        </>
    );
};

export default DocumentListing;