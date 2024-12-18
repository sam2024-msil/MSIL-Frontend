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

const AddUserModal: React.FC<{ show: boolean; handleClose: () => void }> = ({ show, handleClose }) => {

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
    getModules();
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
    console.log(" selectedOption :: ", selectedOption, " selectedOptions :: ", selectedOptions);
    if (Object.keys(selectedOption).length !== 0) {
      if ((!isAdmin && selectedOptions.length > 0)) {
        axiosInstance.post(`/users/`, { ModuleIDs: selectedOptions, MSILUserEmail: selectedOption?.label }).then((res) => {
          console.log(res);
          showSuccess('User created successfully')
        }).catch((e) => {
          console.error(e);
        })
      } else {
        showError('Please select atlest one module to the selected user')
      }
    } else {
      showError('Please select the user');
    }
    e.preventDefault();
  }

  return (
    <Modal show={show} onHide={() => {
      setSelectedOptions([]);
      setSelectedOption(null);
      setIsAdmin(false);
      handleClose();
    }} className={`${styles['modal-dialog']}`}>
      <Modal.Header closeButton>
        <Modal.Title className={`${styles['modal-heading']}`}>Add User</Modal.Title>
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
              Add
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddUserModal;