import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import styles from './UserList.module.scss';

const AddUserModal: React.FC<{ show: boolean; handleClose: () => void }> = ({ show, handleClose }) => {

  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const onSwitchAction = () => {
    setIsSwitchOn(!isSwitchOn);
  };
  return (
    <Modal show={show} onHide={handleClose} className={`${styles['modal-dialog']}`}>
      <Modal.Header closeButton>
        <Modal.Title className={`${styles['modal-heading']}`}>Add User</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${styles['modal-body']}`}>
        <Form>
          <div className="mb-3">
            <label htmlFor="selectUser" className="form-label">Select User</label>
            <select className="form-select" aria-label="Select User">
              <option selected>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
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

          <Form.Switch
            onChange={onSwitchAction}
            id="custom-switch"
            label="Admin"
            checked={isSwitchOn}
          />
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

export default AddUserModal;