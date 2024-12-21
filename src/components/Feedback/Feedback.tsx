import { ChangeEvent, useEffect, useState } from 'react';
import "../Feedback/Feedback.scss";
import { Modal, Button, Form } from 'react-bootstrap';
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
import axiosInstance from '../../api/axios';

interface FeedbackOptionType {
  key: number;
  label: string;
}

interface FeedbackComponentProps {
  onFeedbackSubmit: (rating: number, options: Array<number>, message: string, interactionId: string, setShowModal:any) => void;
  interactionId: string;
  givenRating?: number;
}
const Feedback = ({onFeedbackSubmit,interactionId,givenRating}: FeedbackComponentProps) => {
  const [selectedRating, setSelectedRating] = useState(givenRating || 0);
  const [showModal, setShowModal] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState<any>();
  const [selectedOptions, setSelectedOptions] = useState<Array<number> | any>([]);
  const [userComments, setUserComments] = useState<string>('');
 
  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setShowModal(true);
  };
 
  const handleCloseModal = () => {
    setShowModal(false);
  };
  

  const handleSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    const itemValue = parseInt(value);

    setSelectedOptions((prevSelectedItems: any) => {
        if (!Array.isArray(prevSelectedItems)) {
            return [];
        }

        if (checked) {
            return [...prevSelectedItems, itemValue];
        } else {
            return prevSelectedItems.filter((item) => item !== itemValue);
        }
    });
};

const submitHandler = (e:any) => {
  e.preventDefault();
  onFeedbackSubmit(selectedRating, selectedOptions, userComments,interactionId,setShowModal);
}

const getFeedbackCategory = () => {
  axiosInstance.get(`/feedback-categories`)
  .then((res) => {
    if(res) {
      setFeedbackCategory(res.data);
    }
  }).catch((e) => {
    console.log(e)
  })
}

useEffect(() => {
  if(showModal) {
    getFeedbackCategory();
  }
},[showModal])

useEffect(() => {
  (givenRating) ? setSelectedRating(givenRating) : setSelectedRating(0);
}, [givenRating])

useEffect(() => {
  if (!showModal && givenRating) {
      setSelectedRating(givenRating);
  }
  setSelectedOptions([]);
}, [showModal])

useEffect(() => {
  setSelectedOptions([]);
}, [selectedRating])

  return (
    <div className="smiley-icons">
      <div onClick={() => handleRatingClick(1)}>
        {(selectedRating === 1) ? <img src={SmileyOneSelected} alt="Smile One Icon" width="24" /> : <img src={SmileyOneIcon} alt="Smile One Icon" width="24" /> }
      </div>
      <div onClick={() => handleRatingClick(2)}>
        {(selectedRating === 2) ? <img src={SmileyTwoSelected} alt="Smile One Icon" width="24" /> : <img src={SmileyTwoIcon} alt="Smile Two Icon" width="24" /> }
      </div>
      <div onClick={() => handleRatingClick(3)}>
        {(selectedRating === 3) ? <img src={SmileyThreeSelected} alt="Smile One Icon" width="24" /> : <img src={SmileyThreeIcon} alt="Smile Three Icon" width="24" /> }
      </div>
      <div onClick={() => handleRatingClick(4)}>
        {(selectedRating === 4) ? <img src={SmileyFourSelected} alt="Smile One Icon" width="24" /> : <img src={SmileyFourIcon} alt="Smile Four Icon" width="24" /> }
      </div>
      <div onClick={() => handleRatingClick(5)}>
      {(selectedRating === 5) ? <img src={SmileyFiveSelected} alt="Smile One Icon" width="24" /> : <img src={SmileyFiveIcon} alt="Smile Five Icon" width="24" /> }
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton className='pb-0 border-bottom-0'>
      </Modal.Header>
      <Modal.Body>
        <div className="smiley-icons justify-content-center mb-3">
          <img src={selectedRating === 1 ? SmileyOneSelected : SmileyOneIcon} alt="Smile One Icon" width="30" className={selectedRating === 1 ? 'selected' : ''} onClick={() => setSelectedRating(1)}/>
          <img src={selectedRating === 2 ? SmileyTwoSelected : SmileyTwoIcon} alt="Smile Two Icon" width="30" className={selectedRating === 2 ? 'selected' : ''} onClick={() => setSelectedRating(2)} />
          <img src={selectedRating === 3 ? SmileyThreeSelected : SmileyThreeIcon} alt="Smile Three Icon" width="30" className={selectedRating === 3 ? 'selected' : ''} onClick={() => setSelectedRating(3)} />
          <img src={selectedRating === 4 ? SmileyFourSelected : SmileyFourIcon} alt="Smile Four Icon" width="30" className={selectedRating === 4 ? 'selected' : ''} onClick={() => setSelectedRating(4)} />
          <img src={selectedRating === 5 ? SmileyFiveSelected : SmileyFiveIcon} alt="Smile Five Icon" width="30" className={selectedRating === 5 ? 'selected' : ''} onClick={() => setSelectedRating(5)} />
        </div>
        <div className='feedback-body-section'>
            <p className='feedback-paragraph'>{feedbackCategory?.feedbackCategories?.find((e: any) => e.rating === selectedRating)?.prompt}</p>
            <Form>
            {
                feedbackCategory?.feedbackCategories?.find((e: any) => e.rating === selectedRating)?.options.map((option: FeedbackOptionType) => (
                  <div className="form-check form-check-model mb-3">
                          <Form.Check
                            key={option.key}
                            type="checkbox"
                            name={`option${option.key}`}
                            id={`label${option.key}`}
                            label={option.label}
                            checked={selectedOptions.includes(option.key)}
                            onChange={handleSelectChange}
                            value={option.key}
                          />
                  </div>
                ))
              }
            <Form.Group className="mt-4">
                <Form.Control as="textarea" rows={3} onChange={(e) => setUserComments(e.target.value)} className='comments-textarea' placeholder="Add your comments..." />
            </Form.Group>
            <Button variant="primary" onClick={(e) => submitHandler(e)} type="submit" className="w-100 mt-3 text-center">
                Send
            </Button>
            </Form>
        </div>
      </Modal.Body>
    </Modal>

    </div>
  );
};
 
export default Feedback;