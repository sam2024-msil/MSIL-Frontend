import { Modal, Button } from 'react-bootstrap';
import styles from '../Chat.module.scss';

interface NewChatPopupProps {
  show: boolean;
  handleClose: (decision:boolean) => void;
}

const ChatClearPopup: React.FC<NewChatPopupProps> = ({ show, handleClose }) => {
  return (
      <Modal show={show} onHide={() => handleClose(false)}>
          <Modal.Header closeButton>
              <Modal.Title className={`${styles['modal-heading']}`}>Are you sure you want to start a new chat?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div>
                  <p className={`${styles.newChatContent} mb-3`}>
                      A new chat will clear your previous conversations and you won’t have access to them anymore.
                  </p>
              </div>
              <div className="text-end">
                  <button type="button" className='mt-3 me-2 btn btn-outline-primary' onClick={() => {
                      handleClose(false);
                  }}>
                      Cancel
                  </button>
                  <Button variant="primary" type='submit' className='mt-3'
                  onClick={() => handleClose(true)}
                  >
                      Ok
                  </Button>
              </div>
          </Modal.Body>
      </Modal>
  );
};

export default ChatClearPopup;