import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Select from "react-select";
import { Modal, Button, Table, Form } from 'react-bootstrap';
import uploadIcon from '../../assets/upload-icon.svg'
import styles from './DocumentListing.module.scss';
import DeleteIcon from '../../assets/delete-icon.svg';
import pdfIcon from '../../assets/pdfIcon.svg';
import axiosInstance from '../../api/axios';
import { useToast } from '../../context/ToastContext';


interface moduleDetails {
  ModuleName: string;
  ModuleID: number;
  CreatedOn: string;
}
const UploadModal: React.FC<{ show: boolean; handleClose: () => void }> = ({ show, handleClose }) => {

  const { showSuccess, showError } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [moduleList, setModuleList] = useState();
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDelete = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };


  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const handleChange = (id:number,selected: any) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [id]: selected,
    }));
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

  const uploadDocument = () => {
    let bodyFormData = new FormData();
    files.forEach((file: any) => {
      bodyFormData.append('files', file);
    });
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
    bodyFormData.append('file_catagory', JSON.stringify(selectedModues));

    axiosInstance.post(`/upload`,bodyFormData,{
      headers: {
        'Content-Type': `multipart/form-data`
      },
      timeout: 60000
    }).then((res) => {
      if(res) {
        showSuccess("Documents Uploaded successfully")
      }
    }).catch((e) => {
      console.error(e)
    })
  }

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title className={`${styles['modal-heading']}`}>Upload File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-4">
            <div {...getRootProps({ className: `${styles['drag-drop-section']} p-3` })}>
              <input {...getInputProps()} />
              <div className='text-center'>
                <img src={uploadIcon} width="50" alt="upload icon" className={`${styles['modal-upload-icon']}`} />
                <p className='mt-3 mb-0'><span className={`${styles['click-upload-text']} me-2`}>Click to upload</span><span className={`${styles['or-text']}`}>or</span><span className='ms-2'> Drag and Drop</span></p>
                <h6>PDF, Doc, Word</h6>
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
                    files.map((file, index:number) => (
                      <tr key={index}>
                        <td><Form.Check type="checkbox" /></td>
                        <td><img src={pdfIcon} /> &nbsp; {file.name}</td>
                        <td>
                        {/* <Form.Select aria-label="Default select example">
                          <option>Open this select menu</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </Form.Select> */}
                        <Select
                          options={moduleList}
                          isMulti
                          value={selectedOptions[index] || null}
                          onChange={(options) => handleChange(index,options)}
                          placeholder="Modules"
                        />
                        </td>
                        <td><img src={DeleteIcon} alt="Delete Icon" onClick={() => handleDelete(index)} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        <Button variant="primary" className='mt-3 float-end' onClick={uploadDocument}>
          Upload
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default UploadModal;