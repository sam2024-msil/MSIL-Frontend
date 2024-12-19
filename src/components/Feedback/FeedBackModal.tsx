import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import "../Feedback/Feedback.scss";
import SmileyOneIcon from '../../assets/SmileyIcons/SmileyOneIcon.svg';
import SmileyTwoIcon from '../../assets/SmileyIcons/SmileyTwoIcon.svg';
import SmileyThreeIcon from '../../assets/SmileyIcons/SmileyThreeIcon.svg';
import SmileyFourIcon from '../../assets/SmileyIcons/SmileyFourIcon.svg';
import SmileyFiveIcon from '../../assets/SmileyIcons/SmileyFiveIcon.svg';
import SmileyOneSelected from '../../assets/SmileyIcons/SmileyOneSelectedIcon.svg';
import SmileyTwoSelected from '../../assets/SmileyIcons/SmileyTwoSelectedIcon.svg';
import SmileyThreeSelected from '../../assets/SmileyIcons/SmileyThreeSelectedIcon.svg';
import SmileyFourSelected from '../../assets/SmileyIcons/SmileyFourSelectedIcon.svg';
import SmileyFiveSelected from '../../assets/SmileyIcons/SmileyFiveSelectedIcon.svg';
 
interface ModalProps {
  show: boolean;
  handleClose: () => void;
  rating: string;
}
 
const FeedbackModal: React.FC<ModalProps> = ({ show, handleClose, rating }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className='pb-0 border-bottom-0'>
      </Modal.Header>
      <Modal.Body>
        <div className="smiley-icons justify-content-center mb-3">
          <img src={rating === "Terrible" ? SmileyOneSelected : SmileyOneIcon} alt="Smile One Icon" width="30" className={rating === "Terrible" ? 'selected' : ''} />
          <img src={rating === "Bad" ? SmileyTwoSelected : SmileyTwoIcon} alt="Smile Two Icon" width="30" className={rating === "Bad" ? 'selected' : ''} />
          <img src={rating === "Average" ? SmileyThreeSelected : SmileyThreeIcon} alt="Smile Three Icon" width="30" className={rating === "Average" ? 'selected' : ''} />
          <img src={rating === "Good" ? SmileyFourSelected : SmileyFourIcon} alt="Smile Four Icon" width="30" className={rating === "Good" ? 'selected' : ''} />
          <img src={rating === "Excellent" ? SmileyFiveSelected : SmileyFiveIcon} alt="Smile Five Icon" width="30" className={rating === "Excellent" ? 'selected' : ''} />
        </div>
        <div className='feedback-body-section'>
            <p className='feedback-paragraph'>Oh no, we missed the mark. Could you share what was missing or went wrong?</p>
            <Form>
            <Form.Check
                type="checkbox"
                label="The information was incorrect or misleading."
            />
            <Form.Check
                type="checkbox"
                label="The response didn’t relate to my question"
            />
            <Form.Check
                type="checkbox"
                label="The answer was incomplete or unclear."
            />
            <Form.Check
                type="checkbox"
                label="I encountered technical issues with the response."
            />
            <Form.Group className="mt-4">
                <Form.Control as="textarea" rows={3} className='comments-textarea' placeholder="Add your comments..." />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3 text-center">
                Send
            </Button>
            </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};
 
export default FeedbackModal;