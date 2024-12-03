import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import styles from './UserList.module.scss';

const AddVendorModal: React.FC<{ show: boolean; handleClose: () => void }> = ({ show, handleClose }) => {

  return (
    <Modal show={show} onHide={handleClose} className={`${styles['modal-dialog']}`}>
      <Modal.Header closeButton>
        <Modal.Title className={`${styles['modal-heading']}`}>Add Vendor</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${styles['modal-body']}`}>
        <Form>
          <div className="mb-3">
            <label htmlFor="userNameInput" className="form-label">Username</label>
            <input type="text" className="form-control" id="userNameInput" placeholder="" />
          </div>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">Email</label>
            <input type="email" className="form-control" id="emailInput" placeholder="" />
          </div>
          <div className="mb-3">
            <label htmlFor="vendorCodeInput" className="form-label">Vendor Code</label>
            <input type="text" className="form-control" id="vendorCodeInput" placeholder="" />
          </div>
          <div className="mb-3">
            <label htmlFor="selectModule" className="form-label">Module</label>
            <select className="form-select" aria-label="Select Module">
              <option selected>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
        </Form>
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

export default AddVendorModal;