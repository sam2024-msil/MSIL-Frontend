import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './moduleList.module.scss';
import axiosInstance from '../../api/axios';
import { useToast } from '../../context/ToastContext';
 
const UploadModuleModal: React.FC<{ show: boolean; handleClose: () => void; moduleId: number; moduleNameForEdit: string }> = ({ show, handleClose, moduleId, moduleNameForEdit }) => {
  const { showSuccess, showError } = useToast();
  const [moduleName, setModuleName] = useState<string>('');
  const [error, setError] = useState<string>('');
 
  const addModule = () => {
    if (!moduleName) {
      setError('Module name is required');
      return;
    }
    const specialCharPattern = /[^a-zA-Z0-9 ]/;
    if (specialCharPattern.test(moduleName)) {
      setError('Module name should not contain special characters');
      return;
    }
 
    if (!moduleId) {
      axiosInstance.post(`/modules/?module_name=${moduleName}`)
        .then((response) => {
          if (response) {
            showSuccess('Module created successfully');
            handleClose();
          }
        }).catch((e) => {
          console.error(e);
          showError(e?.response?.data?.detail);
        });
    } else {
      axiosInstance.put(`/modules/${moduleId}?new_name=${moduleName}`)
        .then((res) => {
          if (res) {
            showSuccess('Module updated successfully');
            handleClose();
          }
        }).catch((e) => {
          console.error(e);
          showError(e?.response?.data?.detail);
        });
    }
  };
 
  useEffect(() => {
    if (moduleId) {
      setModuleName(moduleNameForEdit);
    }
  }, [moduleId, moduleNameForEdit]);
 
  return (
    <Modal show={show} onHide={() => { setModuleName(''); setError(''); handleClose(); }} className={`${styles['modal-dialog']}`}>
      <Modal.Header closeButton>
        <Modal.Title className={`${styles['modal-heading']}`}>{moduleId ? 'Edit Module' : 'Add Module'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${styles['modal-body']}`}>
        <div className="mb-3">
          <label htmlFor="moduleNameInput" className="form-label">Module Name</label>
          <input
            type="text"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={moduleName}
            onChange={(e) => { setModuleName(e.target.value); setError(''); }}
            id="moduleNameInput"
            placeholder=""
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
        <div className='text-end'>
          <button type="button" onClick={() => { setModuleName(''); setError(''); handleClose(); }} className='mt-3 me-3 btn btn-outline-primary'>
            Cancel
          </button>
          <Button variant="primary" className='mt-3' onClick={addModule}>
            {moduleId ? 'Update' : 'Add'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
 
export default UploadModuleModal;