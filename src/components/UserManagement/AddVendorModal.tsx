import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from "react-select";
import styles from './UserList.module.scss';
import axiosInstance from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import Loader from '../Spinner/Spinner';

interface moduleDetails {
  ModuleName: string;
  ModuleID: number;
  CreatedOn: string;
}

type FormValues = {
  firstName: string;
  lastName: string;
  userName: string;
  vendorCode?: string; // Optional
  module?: string[];
};

const AddVendorModal: React.FC<{ show: boolean; handleClose: () => void,editUserData:any }> = ({ show, handleClose, editUserData }) => {

  const { showSuccess, showError } = useToast();
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [moduleList, setModuleList] = useState<{ value: number; label: string }[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const [formValues, setFormValues] = useState<FormValues>({
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
      const moduleNames = editUserData?.Modules?.join(', ');
      const labels = moduleNames?.split(',')?.map((label:string) => label.trim().toLowerCase());
      const result:any = moduleList?.filter(item => labels.includes(item.label.toLowerCase())).map(item => ({ value: item.value, label: item.label }));
      setSelectedOptions(result);
      setFormValues({firstName:editUserData?.FirstName,lastName:editUserData?.LastName,userName:editUserData?.Email})
    } else {
      resetFormData();
    }
  },[editUserData])

  const resetFormData = () => {
    setErrors({firstName: '',lastName: '',userName: '',vendorCode: '',module: ''});
    setFormValues({firstName: '',lastName: '',userName: '',vendorCode: '',module: []});
    setSelectedOptions([]);
  }
  const getModules = () => {
    setShowLoader(true);
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
          setModuleList(updatedArray);
          setShowLoader(false);
        }
      }).catch((e) => {
        console.error(e);
        setShowLoader(false);
      })
  }

  const handleModuleSelectChange = (selected: any) => {
    const selectedIds = selected.map((item:any) => item.value);  
    setFormValues((prevState:any) => ({   
      ...prevState, 
      module: selectedIds,
    }));
    setSelectedOptions(selected); 
  };
  useEffect(() => {
    (show) && getModules();
  }, [show])

  const createVendormHandler = () => {
    if (formValues.firstName) {
      const reqPayload = (editUserData) ? { RoleID:3, ModuleIDs: formValues.module,IsAdmin:false } : {
        FirstName: formValues.firstName,
        LastName: formValues.lastName,
        UserEmailId: formValues.userName,
        VendorCode: formValues.vendorCode,
        ModuleIDs: formValues.module
      }
      setShowLoader(true);
      const apiUrl = (editUserData) ? `/users/${editUserData?.ID}` : '/vendoruser/';
      axiosInstance.post(`${apiUrl}`, reqPayload)
        .then((res) => {
          if (res) {
            showSuccess(res.data.message);
            resetFormData();
            handleClose();
          }
          setShowLoader(false);
        }).catch((e) => {
          console.log(e);
          showError(e.response.data.detail);
          setShowLoader(false);
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
    if (formValues?.vendorCode && !formValues?.vendorCode.trim()) {
      newErrors.vendorCode = 'Vendor code is required';
      valid = false;
    }
    if (!selectedOptions.length) {
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

  useEffect(() => {
      if(!selectedOptions.length) {
      setSelectedOptions([{
        label: "Common",
        value: 17}]);
      }
  },[moduleList])

  return (
    <>
    {showLoader && <Loader />}
    <Modal show={show} onHide={() => {
      resetFormData();
      handleClose();
      }} className={`${styles['modal-dialog']}`}>
      <Modal.Header closeButton>
        <Modal.Title className={`${styles['modal-heading']}`}>
          {editUserData ? 'Edit Vendor' : 'Add Vendor'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${styles['modal-body']} ${styles['modal-body-scrollable']}`}>
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="userNameInput" className="form-label">First Name</label>
            <input type="text" name='firstName' disabled={(editUserData) ? true : false} value={formValues.firstName} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} onChange={handleChange} id="firstNameInput" placeholder="" />
            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="userNameInput" className="form-label">Last Name</label>
            <input type="text" name="lastName" disabled={(editUserData) ? true : false} value={formValues.lastName} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} onChange={handleChange} id="lastNameInput" placeholder="" />
            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">Username</label>
            <input type="text" name='userName' disabled={(editUserData) ? true : false} value={formValues.userName} className={`form-control ${errors.userName ? 'is-invalid' : ''}`} onChange={handleChange} id="userNameInput" placeholder="" />
            {errors.userName && <div className="invalid-feedback">{errors.userName}</div>}
          </div>
          {!editUserData &&
          <div className="mb-3">
            <label htmlFor="vendorCodeInput" className="form-label">Vendor Code</label>
            <input type="text" name='vendorCode' disabled={(editUserData) ? true : false} value={formValues.vendorCode} className={`form-control ${errors.vendorCode ? 'is-invalid' : ''}`} onChange={handleChange} id="vendorCodeInput" placeholder="" />
            {errors.vendorCode && <div className="invalid-feedback">{errors.vendorCode}</div>}
          </div> }
          <div className="mb-3">
            <label htmlFor="selectModule" className="form-label">Module</label>
            <Select
              options={moduleList}
              isMulti
              value={selectedOptions || null}
              onChange={(options) => handleModuleSelectChange(options)}
              placeholder="Modules"
              name='module'
              className={`${styles.selectBox} ${errors.module ? 'is-invalid' : ''}`}
            />
            {errors.module && <div className="invalid-feedback">{errors.module}</div>}
          </div>
          <div className='mb-3 text-end'>
            <button type="button" className='mt-3 me-2 btn btn-outline-primary' onClick={() => { resetFormData(); handleClose(); }}>
              Cancel
            </button>
            <Button variant="primary" type='submit' className='mt-3'>
              {editUserData ? 'Update':'Add'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
    </>
  );
};

export default AddVendorModal;