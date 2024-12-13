import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './moduleList.module.scss';
import axiosInstance from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const UploadModuleModal: React.FC<{ show: boolean; handleClose: () => void;moduleId:number, moduleNameForEdit: string }> = ({ show, handleClose, moduleId, moduleNameForEdit }) => {

  const { showSuccess, showError } = useToast();
  const [moduleName, setModuleName] = useState<string>('')

  const addModule = () => {
    if (!moduleId && moduleName) {
      axiosInstance.post(`/modules/?module_name=${moduleName }`)
        .then((response) => {
          if (response) {
            showSuccess('Module created successfully');
            handleClose()
          }
        }).catch((e) => {
          console.error(e)
          showError(e?.response?.data?.detail)
        })
    }
    if(moduleId && moduleName) {
      axiosInstance.put(`/modules/${moduleId}?new_name=${moduleName}`)
      .then((res) => {
        if(res) {
          showSuccess('Module updated successfully');
          handleClose()
        }
      }).catch((e) => {
        console.error(e)
        showError(e?.response?.data?.detail)
      })
    }
  }

  useEffect(() => {
    if(moduleId) {
      setModuleName(moduleNameForEdit)
    }
  },[moduleId])

  return (
    <Modal show={show} onHide={() => {setModuleName(''); handleClose()}} className={`${styles['modal-dialog']}`}>
      <Modal.Header closeButton>
        {(!moduleId) ? <Modal.Title className={`${styles['modal-heading']}`}>Add Module</Modal.Title> : <Modal.Title className={`${styles['modal-heading']}`}>Edit Module</Modal.Title> }
      </Modal.Header>
      <Modal.Body className={`${styles['modal-body']}`}>
        <div className="mb-3">
          <label htmlFor="moduleNameInput" className="form-label">Module Name</label>
          <input type="text" className="form-control" value={moduleName} onChange={(e) => setModuleName(e.target.value)} id="moduleNameInput" placeholder="" />
        </div>
        <Button variant="primary" className='mt-3 float-end' onClick={addModule}>
        {(!moduleId) ? 'Add' : 'Update' }
        </Button>
        <button type="button" onClick={() => {setModuleName(''); handleClose()}} className='mt-3 float-end me-3 btn btn-outline-primary'>
          Cancel
        </button>
      </Modal.Body>
    </Modal>
  );
};

export default UploadModuleModal;