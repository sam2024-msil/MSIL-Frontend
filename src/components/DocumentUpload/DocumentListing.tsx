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
    // const [isMenuOpen, setIsMenuOpen] = useState(false);
 
    // const toggleMenu = () => {
    //     setIsMenuOpen(!isMenuOpen);
    // };

    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        setEditData({});
        setTriggerTableApi(triggerTableApi + 1);
    }
    console.log(showLoader)

    const downloadPDF = (rowData:any) => {
        console.log(rowData)
    const fileBlob = new Blob(['https://azcistrgvendorgptdev01.blob.core.windows.net/msilchunkingdocs/31-41Pages.pdf?sp=r&st=2024-12-11T04:40:05Z&se=2024-12-11T12:40:05Z&sv=2022-11-02&sr=b&sig=6hUDPxtEVOTv0GxHhwzmX1BSWOQYGti8Fn2q0f7Hdhc%3D'], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(fileBlob);
      link.setAttribute('download', 'test.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
                    return (
                        <span className={styles[row?.values?.doc_status.toLowerCase()]}>
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
        console.log(" pdfParam :: ", pdfParam)
        setShowPDFModal(true);
        setPdfLink('https://azcistrgvendorgptdev01.blob.core.windows.net/msilchunkingdocs/31-41Pages.pdf?sp=r&st=2024-12-11T04:40:05Z&se=2024-12-11T12:40:05Z&sv=2022-11-02&sr=b&sig=6hUDPxtEVOTv0GxHhwzmX1BSWOQYGti8Fn2q0f7Hdhc%3D')

    }
    const handleEdit = (rowData:any) => {
        setShowModal(true);
        setEditData(rowData);
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
        try {
            const response = await axiosInstance.get(`/listOfDocs?${queryParams.toString()}`);
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
          axiosInstance.post(`/delet-doc?doc_id=${docDeleteId}`)
          .then((res) => {
            if(res) {
              showSuccess('Document deleted successfully');
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
                            <DataTable columns={columns} tableType={'documentList'} fetchData={fetchData} searchString={searchKeyword} triggerTableApi={triggerTableApi} startDate={''} endDate={''} />
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