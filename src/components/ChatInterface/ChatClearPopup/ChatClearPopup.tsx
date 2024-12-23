import { Modal } from 'react-bootstrap';

interface ChatClearPopupProps {
    setShowModal: (decision:boolean) => void;
    showModal: boolean;
    givenRating?: number;
}

const ChatClearPopup = ({showModal,setShowModal}:ChatClearPopupProps) => {

    const handleCloseModal = () => {
        setShowModal(false);
      };

    return(
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton className='pb-0 border-bottom-0'>
      </Modal.Header>
      <Modal.Body>
        <div className='feedback-body-section'>
            
        </div>
      </Modal.Body>
    </Modal>
    )
}

export default ChatClearPopup;