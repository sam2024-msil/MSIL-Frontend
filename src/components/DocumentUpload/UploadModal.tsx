import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import uploadIcon from '../../assets/upload-icon.svg'
import styles from './DocumentListing.module.scss';
import DeleteIcon from '../../assets/delete-icon.svg';

const UploadModal: React.FC<{ show: boolean; handleClose: () => void }> = ({ show, handleClose }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDelete = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

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
                    files.map((file, index) => (
                      <tr key={index}>
                        <td><Form.Check type="checkbox" /></td>
                        <td>{file.name}</td>
                        <td>
                        <Form.Select aria-label="Default select example">
                          <option>Open this select menu</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </Form.Select>
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
        <Button variant="primary" className='mt-3 float-end'>
          Upload
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default UploadModal;