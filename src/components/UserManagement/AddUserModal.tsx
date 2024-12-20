import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import styles from './UserList.module.scss';
import Select from "react-select";
import axiosInstance from '../../api/axios';
import { useToast } from '../../context/ToastContext';

interface moduleDetails {
  ModuleName: string;
  ModuleID: number;
  CreatedOn: string;
}

const AddUserModal: React.FC<{ show: boolean; handleClose: () => void, editUserData:any }> = ({ show, handleClose, editUserData }) => {
  console.log(" editUserData :: ", editUserData)
  const { showSuccess, showError } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState<{ value: number; label: string }[]>([]);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [moduleList, setModuleList] = useState<{ value: number; label: string }[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const onSwitchAction = () => {
    setIsAdmin(!isAdmin);
  };

  const handleInputChange = async (value: string) => {
    setInputValue(value);
    setIsLoading(true);

    try {
      if (value) {
        const response = await axiosInstance.get(`search-users?query=${value}`);
        const newOptions: [] = response.data;
        const transformedArray = newOptions.map((item: any) => ({
          label: item.mail,
          value: item.mail
        }));
        setDropdownOptions(transformedArray);
      }
    } catch (error) {
      console.error("Error fetching new options:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (selected: any) => {
    setSelectedOption(selected);
  }

  const handleModuleChange = (selected: any) => {
    setSelectedOptions(selected)
  };

  useEffect(() => {
    (show) && getModules();
  }, [])

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

  const createUser = (e: React.FormEvent) => {
    if (Object.keys(selectedOption).length !== 0) {
      const selectedModule = selectedOptions.map(item => item.value);
      if (isAdmin) {
        const apiUrl = (editUserData) ? `/users/${editUserData?.ID}` : '/users/';
        const reqBody = (editUserData) ? { RoleID:1, ModuleIDs:(isAdmin) ? [] : selectedModule,IsAdmin:isAdmin } : { ModuleIDs: [], MSILUserEmail: selectedOption?.label, IsAdmin:isAdmin } ;
        axiosInstance.post(`${apiUrl}`, reqBody).then((res) => {
          console.log(res)
          showSuccess('User created successfully');
          setSelectedOptions([]);
          setSelectedOption(null);
          setIsAdmin(false);
          handleClose();
        }).catch((e) => {
          console.error(e);
          showError(e?.response?.data?.detail);
        })
      } else {
        if(selectedOptions.length > 0) {
          const apiUrl = (editUserData) ? `/users/${editUserData?.ID}` : '/users/';
          const reqBody = (editUserData) ? { RoleID:2, ModuleIDs:selectedModule,IsAdmin:false } : { ModuleIDs: selectedModule, MSILUserEmail: selectedOption?.label, IsAdmin:isAdmin };
          axiosInstance.post(`${apiUrl}`, reqBody).then((res) => {
            console.log(res)
            showSuccess('User created successfully');
            setSelectedOptions([]);
            setSelectedOption(null);
            setIsAdmin(false);
            handleClose();
          }).catch((e) => {
            console.error(e);
            showError(e?.response?.data?.detail);
          })
        } else {
          showError('Please select atleast one module to the selected user');
        }
      }
    } else {
      showError('Please select the user');
    }
    e.preventDefault();
  }

  useEffect(() => {
    if (editUserData) {
      setSelectedOption({ value: editUserData.Email, label: editUserData.Email });
      setInputValue(editUserData.Email);
      const moduleNames = editUserData?.Modules.join(', ');
      const labels = moduleNames?.split(',')?.map((label:string) => label.trim().toLowerCase());
      const result:any = moduleList?.filter(item => labels.includes(item.label.toLowerCase())).map(item => ({ value: item.value, label: item.label }));
      setSelectedOptions(result);
      setIsAdmin(editUserData?.IsAdmin)
    } else {
      setSelectedOption(null);
      setInputValue('');
      setSelectedOptions([]);
    }
  }, [editUserData]);


  return (
    <Modal show={show} onHide={() => {
      setSelectedOptions([]);
      setSelectedOption(null);
      setIsAdmin(false);
      handleClose();
    }} className={`${styles['modal-dialog']}`}>
      <Modal.Header closeButton>
        <Modal.Title className={`${styles['modal-heading']}`}>
          {(editUserData !=null) ? 'Edit User' : 'Add User'}
          </Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${styles['modal-body']}`}>
        <Form onSubmit={createUser}>
          <div className="mb-3">
            <label htmlFor="selectUser" className="form-label">Select User</label>
            <Select
              options={dropdownOptions}
              value={selectedOption}
              onChange={handleChange}
              onInputChange={handleInputChange}
              isSearchable
              inputValue={inputValue}
              isLoading={isLoading}
              placeholder="Type to select the user.."
              className={`${editUserData !==null ? styles['select-disabled'] : ''}`}
            />
          </div>
          <div className="mb-3">
            <Form.Switch
              onChange={onSwitchAction}
              id="custom-switch"
              label="Admin"
              checked={isAdmin}
            />
          </div>
          {(!isAdmin) &&
            <div className="mb-3">
              <label htmlFor="selectModule" className="form-label">Module</label>
              <Select
                options={moduleList}
                isMulti
                value={selectedOptions}
                onChange={(options) => handleModuleChange(options)}
                placeholder="Modules"
              />
            </div>
          }
          <div className="text-end">
            <button type="button" className='mt-3 me-2 btn btn-outline-primary' onClick={() => {
              setSelectedOptions([]);
              setSelectedOption(null);
              setIsAdmin(false);
              handleClose();
            }}>
              Cancel
            </button>
            <Button variant="primary" type='submit' className='mt-3'>
              {editUserData ? 'Edit' : 'Add'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default React.memo(AddUserModal);