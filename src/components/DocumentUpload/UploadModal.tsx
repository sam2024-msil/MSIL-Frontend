import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Select from "react-select";
import { Modal, Button, Table } from 'react-bootstrap';
import uploadIcon from '../../assets/upload-icon.svg'
import styles from './DocumentListing.module.scss';
import DeleteIcon from '../../assets/delete-icon.svg';
import pdfIcon from '../../assets/pdfIcon.svg';
import axiosInstance from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import DeleteConfimationModal from '../../shared/DeleteConfirmationModal/DeleteConfirmationModal';
import Loader from '../Spinner/Spinner';


interface moduleDetails {
  ModuleName: string;
  ModuleID: number;
  CreatedOn: string;
}
const UploadModal: React.FC<{ show: boolean; handleClose: () => void,editData:any }> = ({ show, handleClose, editData }) => {
  
  const { showSuccess, showError } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [moduleList, setModuleList] = useState<{ value: number; label: string }[]>([]);
  const [showFileReuploadConfirm, setShowFileReuploadConfirm] = useState<boolean>(false);
  const [msgToDuplicateUpload, setMsgToDuplicateUpload] = useState<string>('');
  const [selectedOptionsInEditmode, setSelectedOptionsInEditmode] = useState<{ value: number; label: string }[] | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      if ((acceptedFiles.length)+files.length <= 5) {
        let validFile:any [] = [];
        let currentFileSize = Array.from(acceptedFiles).reduce((sum, file) => {
          if (file && typeof file.size === 'number') {
            return sum + file.size;
          }
          return sum;
        }, 0);
        let showFileSizeError=false;
        const totalFileSize = files.reduce((sum, totalFile) => sum + totalFile.size, 0) + currentFileSize;
        acceptedFiles.forEach(async (file: any) => {
          if (file?.type === "application/pdf") {
            //const totalSize = files.reduce((sum, totalFile) => sum + totalFile.size, 0) + file.size;
            const fileSizeInMB = totalFileSize / (1024 * 1024);
            if (fileSizeInMB > 250) {
              showFileSizeError = true;
              // showError('The total file size exceeds 250 MB. Please upload smaller files.');
              return;
            } else {
              validFile.push(file);
            }
          } else {
            showError('The file you are trying to upload appears to be infected or has an unsupported file extension. Please ensure that your file is safe and has the correct format before uploading.');
          }
        })
        if(showFileSizeError)
          { 
            showError('The total file size exceeds 250 MB. Please upload smaller files.');
            showFileSizeError = false;
          }
        setFiles((prevFiles) => [...prevFiles, ...validFile]);
      } else {
        showError('Please note that you can upload up to 5 files at a time with a maximum total size of 250 MB.');
      }
      
    }
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDelete = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    
    setSelectedOptions((prevState) => {
      const newState = { ...prevState }; 
      delete newState[index]; 
      return newState; 
    });
  };

  const handleChange = (id: number=1,selected: any) => {
    if(Object.keys(editData).length === 0 && editData.constructor === Object) {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [id]: selected,
    }));
  } else {
    setSelectedOptionsInEditmode(selected);
  }
  };
useEffect(() => {
  getModules();
},[])
  const getModules = () => {
    axiosInstance.get(`/modules/`)
    .then((res) => {
      if(res) {
        const updatedArray = res.data.map((obj:moduleDetails) => {
          return Object.keys(obj).reduce((acc:any, key) => {
            if (key === 'ModuleID') {
              acc['value'] = obj[key];
            } else if(key === 'ModuleName'){
              acc['label'] = obj[key];
            }
            return acc;
          }, {});
        });
        setModuleList(updatedArray)
      }
    }).catch((e) => {
      console.error(e)
    })
  }

  const getSelectedOptions = () => {
    const selectedModues: any[] = []
    for (let keyArray in selectedOptions) {
        const arrayOfObjects = selectedOptions[keyArray];

        const objj:any = [];
        arrayOfObjects.forEach((obj:any) => {
          Object.entries(obj).forEach(([propertyKey, propertyValue]) => {
            if(propertyKey === 'value')
            objj.push(propertyValue)
          });
          
        });
        selectedModues.push(objj)
        
    }
    return selectedModues;
  }
  const uploadDocument = () => {
    if((files.length === Object.keys(selectedOptions).length)) {
    let bodyFormData = new FormData();
    files.forEach((file: any) => {
      bodyFormData.append('files', file);
    });
    const selectedModues = getSelectedOptions();
    bodyFormData.append('file_category', JSON.stringify(selectedModues));
    setShowLoader(true);
    axiosInstance.post(`/upload`,bodyFormData,{
      headers: {
        'Content-Type': `multipart/form-data`
      },
      timeout: 60000
    }).then((res) => {
      if(res) {
        if (res.data.status_code === '409') {
          setShowFileReuploadConfirm(true);
          setMsgToDuplicateUpload(res.data.message);
        } else {
          showSuccess(res?.data.message)
          setFiles([]);
          setSelectedOptions([]);
          handleClose();
        }
        setShowLoader(false);
      }
    }).catch((e) => {
      console.error(e);
      setShowLoader(false);
      showError(e?.response?.data?.detail)
    })
  } else {
    showError('Please select the atleast one module for each document');
  }
  }

  const duplicateUpload = () => {

    let bodyFormData = new FormData();
    files.forEach((file: any) => {
      bodyFormData.append('files', file);
    });
    const selectedModues = getSelectedOptions();
    bodyFormData.append('file_category', JSON.stringify(selectedModues));
    setShowLoader(true);
    axiosInstance.post(`/re-upload`,bodyFormData,{
      headers: {
        'Content-Type': `multipart/form-data`
      },
      timeout: 60000
    }).then((res) => {
      showSuccess(res?.data.message)
      setFiles([]);
      setSelectedOptions([]);
      handleClose();
      setShowLoader(false);
    }).catch((e) => {
      console.error(e)
      showError(e?.response?.data?.detail);
      setShowLoader(false);
    })
  }
  const onClose = (useAction:string) => {
    if(useAction == 'proceed') {
      setShowFileReuploadConfirm(false);
      setMsgToDuplicateUpload('');
      duplicateUpload();
    } else {
      setShowFileReuploadConfirm(false);
      setMsgToDuplicateUpload('');
      setFiles([]);
      setSelectedOptions([]);
      handleClose();
    }
  }

  useEffect(() => {
    if(Object.keys(editData).length != 0) {
      const moduleNames = editData?.doc_category;
      const labels = moduleNames?.split(',')?.map((label:string) => label.trim().toLowerCase());
      const result:any = moduleList?.filter(item => labels.includes(item.label.toLowerCase())).map(item => ({ value: item.value, label: item.label }));
      setSelectedOptionsInEditmode(result);
    }
  },[editData])
  
  const editMappingModule = () => {

    let categoryValueArray:any = selectedOptionsInEditmode;
    categoryValueArray = categoryValueArray.map((item:any) => item.value);
    setShowLoader(true);
    axiosInstance.post(`/update-doc-model-mapping`,{doc_id: editData?.doc_id,file_category:categoryValueArray})
    .then((res) => {
      if(res) {
        showSuccess(res?.data.message);
        setSelectedOptionsInEditmode(null);
        handleClose();
        setShowLoader(false);
      }
    }).catch((e) => {
      console.error(e);
      showError(e?.response?.data?.detail);
      setShowLoader(false);
    })
  }

  useEffect(() => {
    if(files.length > 0) {
      
      const defaultCommon = Object.values(moduleList).find(item => item.label.toLowerCase() === 'common');
      files.map((file, index:any) => {
        if(index in selectedOptions) {
          console.log("value is there for the index position",file)
        } else {
          const defaultValue = { label: defaultCommon?.label, value: defaultCommon?.value}
          handleChange(index,[defaultValue])
        }
      })
    }
  },[files])
  
  return (
    <>
    {(showLoader) && <Loader />}
    <Modal show={show} onHide={() => { setFiles([]); setSelectedOptions([]); handleClose()}} size="xl">
      <Modal.Header closeButton>
      {(Object.keys(editData).length === 0 && editData.constructor === Object) ?
        <Modal.Title className={`${styles['modal-heading']}`}>Upload File</Modal.Title>
        :
        <Modal.Title className={`${styles['modal-heading']}`}>Edit Module Mapping</Modal.Title>
      }
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          {(Object.keys(editData).length === 0 && editData.constructor === Object) ?
          <>
          <div className="col-md-4">
            <div {...getRootProps({ className: `${styles['drag-drop-section']} p-3 cursor-pointer` })}>
              <input {...getInputProps()} />
              <div className='text-center'>
                <img src={uploadIcon} width="50" alt="upload icon" className={`${styles['modal-upload-icon']}`} />
                <p className='mt-3 mb-0'><span className={`${styles['click-upload-text']} me-2`}>Click to upload</span><span className={`${styles['or-text']}`}>or</span><span className='ms-2'> Drag and Drop</span></p>
                <h6>PDF</h6>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className={`${styles['uploadModal-table-block']} table-responsive`}>
              <Table className={`${styles['uploadModal-table-section']}`}>
                <thead>
                  <tr>
                    <th></th>
                    <th>File</th>
                    <th>Select Module</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {files.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center">
                        File is not uploaded. Please upload the file.
                      </td>
                    </tr>
                  ) : (
                    files.map((file, index:number) => {
                      return (
                      <tr key={index}>
                        <td></td>
                        {/* <td><img src={pdfIcon} /> &nbsp; {file.name}</td> */}
                        <td>
                          <div className='d-flex'>
                            <img src={pdfIcon} alt="PDF Icon" />
                            <p className={`ms-3 ${styles.fileName}`} title={file.name}>{file.name}</p>
                          </div>
                        </td>
                        <td>
                        <Select
                          options={moduleList}
                          isMulti
                          value={selectedOptions[index] || null}
                          onChange={(options) => handleChange(index,options)}
                          placeholder="Modules"
                          menuPosition="fixed"
                          menuPlacement="auto"
                        />
                        </td>
                        <td><img src={DeleteIcon} className='cursor-pointer' alt="Delete Icon" onClick={() => handleDelete(index)} /></td>
                      </tr>
                    ) }
                    )
                  )}
                </tbody>
              </Table>
            </div>
          </div>
          </> : 
          <div className="col-md-12">
          <div className={`${styles['uploadModal-table-block']} table-responsive`}>
            <Table className={`${styles['uploadModal-table-section']}`}>
              <thead>
                <tr>
                  <th></th>
                  <th>File</th>
                  <th>Select Module</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                    <tr>
                      <td></td>
                      {/* <td><img src={pdfIcon} /> &nbsp; {editData?.doc_name}</td> */}
                      <td>
                          <div className='d-flex'>
                            <img src={pdfIcon} alt="PDF Icon" />
                            <p className={`ms-3 ${styles.fileName}`} title={editData.doc_name}>{editData.doc_name}</p>
                          </div>
                        </td>
                      <td>
                      <Select
                        options={moduleList}
                        isMulti
                        value={selectedOptionsInEditmode}
                        onChange={(options) => handleChange(1, options)}
                        placeholder="Modules"
                        menuPosition="fixed"
                        menuPlacement="auto"
                      />
                      </td>
                      <td></td>
                    </tr>
              </tbody>
            </Table>
          </div>
        </div>
          }
        </div>
        {(Object.keys(editData).length === 0 && editData.constructor === Object) ?
        <>
        {(files.length > 0) && 
        <Button variant="primary" className='mt-3 float-end' onClick={uploadDocument}>
          Upload
        </Button>
        }
        </>   :
        <>
        {(selectedOptionsInEditmode !=null && selectedOptionsInEditmode.length > 0) &&
          <Button variant="primary" className='mt-3 float-end' onClick={editMappingModule}>
            Update
          </Button>
        }
        </>
        }
      </Modal.Body>
      {showFileReuploadConfirm && <DeleteConfimationModal show={showFileReuploadConfirm} onClose={onClose} msg={msgToDuplicateUpload} />}
    </Modal>
    </>
  );
};

export default UploadModal;