import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './moduleList.module.scss';

const UploadModuleModal: React.FC<{ show: boolean; handleClose: () => void }> = ({ show, handleClose }) => {


  return (
    <Modal show={show} onHide={handleClose} className={`${styles['modal-dialog']}`}>
      <Modal.Header closeButton>
        <Modal.Title className={`${styles['modal-heading']}`}>Add Module</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${styles['modal-body']}`}>
        <div className="mb-3">
          <label htmlFor="moduleNameInput" className="form-label">Module Name</label>
          <input type="text" className="form-control" id="moduleNameInput" placeholder="" />
        </div>
        <Button variant="primary" className='mt-3 float-end'>
          Add
        </Button>
        <Button variant="secondary" className='mt-3 float-end me-2'>
          Cancel
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default UploadModuleModal;