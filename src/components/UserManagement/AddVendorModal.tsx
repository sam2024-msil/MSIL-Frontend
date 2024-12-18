import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from "react-select";
import styles from './UserList.module.scss';
import axiosInstance from '../../api/axios';
import { useToast } from '../../context/ToastContext';

interface moduleDetails {
  ModuleName: string;
  ModuleID: number;
  CreatedOn: string;
}

const AddVendorModal: React.FC<{ show: boolean; handleClose: () => void,editUserData:any }> = ({ show, handleClose, editUserData }) => {

  const { showSuccess, showError } = useToast();
  const [moduleList, setModuleList] = useState<{ value: number; label: string }[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    vendorCode: '',
    module: [],
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    vendorCode: '',
    module: ''
  });

  useEffect(() => {
    if(editUserData !=null ) {
      const moduleNames = editUserData?.Modules.join(', ');
      console.log( " moduleNames :: ", moduleNames)
      const labels = moduleNames?.split(',')?.map((label:string) => label.trim().toLowerCase());
      const result:any = moduleList?.filter(item => labels.includes(item.label.toLowerCase())).map(item => ({ value: item.value, label: item.label }));
      setSelectedOptions(result);
    }
  },[editUserData])
  const resetFormData = () => {
    setErrors({firstName: '',lastName: '',userName: '',vendorCode: '',module: ''});
    setFormValues({firstName: '',lastName: '',userName: '',vendorCode: '',module: []});
    setSelectedOptions([]);
  }
  const getModules = () => {
    axiosInstance.get(`/modules/`)
      .then((res) => {
        if (res) {
          const updatedArray = res.data.map((obj: moduleDetails) => {
            return Object.keys(obj).reduce((acc: any, key) => {
              if (key === 'ModuleID') {
                acc['value'] = obj[key];
              } else if (key === 'ModuleName') {
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

  const handleModuleSelectChange = (selected: any) => {
    const selectedIds = selected.map((item:any) => item.value);  
    setFormValues((prevState:any) => ({    // For Req payload
      ...prevState, 
      module: selectedIds,
    }));
    setSelectedOptions(selected); // For get select in dorpdown
  };
  useEffect(() => {
    getModules();
  }, [])

  const createVendormHandler = () => {
    if (formValues.firstName) {
      const reqPayload = {
        FirstName: formValues.firstName,
        LastName: formValues.lastName,
        UserEmailId: formValues.userName,
        VendorCode: formValues.vendorCode,
        ModuleIDs: formValues.module
      }
      axiosInstance.post(`/vendoruser/`, reqPayload)
        .then((res) => {
          if (res) {
            showSuccess(res.data.message);
            resetFormData();
            handleClose();
          }
        }).catch((e) => {
          console.log(e);
          showError(e.response.data.detail)
        })
    }
  }

  const validate = () => {
    let valid = true;
    const newErrors = { firstName: '', lastName: '', userName: '', vendorCode: '', module: '' };
    if (!formValues.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }
    if (!formValues.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }
    if (!formValues.userName.trim()) {
      newErrors.userName = 'Username is required';
      valid = false;
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formValues.userName)) {
        newErrors.userName = 'Invalid email format. Please include "@" in the email address.';
        valid = false;
      }
    }
    if (!formValues.vendorCode.trim()) {
      newErrors.vendorCode = 'Vendor code is required';
      valid = false;
    }
    if (!formValues.module) {
      newErrors.module = 'Module selection is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (validate()) {
      createVendormHandler();
    }
    e.preventDefault();
  };

  return (
    <Modal show={show} onHide={() => {
      resetFormData();
      handleClose();
      }} className={`${styles['modal-dialog']}`}>
      <Modal.Header closeButton>
        <Modal.Title className={`${styles['modal-heading']}`}>Add Vendor</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${styles['modal-body']} ${styles['modal-body-scrollable']}`}>
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="userNameInput" className="form-label">First Name</label>
            <input type="text" name='firstName' value={formValues.firstName} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} onChange={handleChange} id="firstNameInput" placeholder="" />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="userNameInput" className="form-label">Last Name</label>
            <input type="text" name="lastName" value={formValues.lastName} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} onChange={handleChange} id="lastNameInput" placeholder="" />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">Username</label>
            <input type="text" name='userName' value={formValues.userName} className={`form-control ${errors.userName ? 'is-invalid' : ''}`} onChange={handleChange} id="userNameInput" placeholder="" />
            {errors.userName && <div className="invalid-feedback">{errors.userName}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="vendorCodeInput" className="form-label">Vendor Code</label>
            <input type="text" name='vendorCode' value={formValues.vendorCode} className={`form-control ${errors.vendorCode ? 'is-invalid' : ''}`} onChange={handleChange} id="vendorCodeInput" placeholder="" />
            {errors.vendorCode && <div className="invalid-feedback">{errors.vendorCode}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="selectModule" className="form-label">Module</label>
            <Select
              options={moduleList}
              isMulti
              value={selectedOptions || null}
              onChange={(options) => handleModuleSelectChange(options)}
              placeholder="Modules"
              name='module'
              className={`form-control ${errors.module ? 'is-invalid' : ''}`}
            />
            {errors.module && <div className="invalid-feedback">{errors.module}</div>}
          </div>
          <div className='mb-3 text-end'>
            <button type="button" className='mt-3 me-2 btn btn-outline-primary' onClick={() => { resetFormData(); handleClose(); }}>
              Cancel
            </button>
            <Button variant="primary" type='submit' className='mt-3'>
              Add
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddVendorModal;