import { useState } from 'react';
import "../Feedback/Feedback.scss";
import SmileyOneIcon from '../../assets/SmileyIcons/SmileyOneIcon.svg';
import SmileyTwoIcon from '../../assets/SmileyIcons/SmileyTwoIcon.svg';
import SmileyThreeIcon from '../../assets/SmileyIcons/SmileyThreeIcon.svg';
import SmileyFourIcon from '../../assets/SmileyIcons/SmileyFourIcon.svg';
import SmileyFiveIcon from '../../assets/SmileyIcons/SmileyFiveIcon.svg';
import FeedbackModal from './FeedBackModal';
 
const SmileyIcons = () => {
  const [selectedRating, setSelectedRating] = useState('');
  const [showModal, setShowModal] = useState(false);
 
  const handleRatingClick = (rating: string) => {
    setSelectedRating(rating);
    setShowModal(true);
  };
 
  const handleCloseModal = () => {
    setShowModal(false);
  };
 
  return (
    <div className="smiley-icons">
      <div onClick={() => handleRatingClick("Terrible")}>
        <img src={SmileyOneIcon} alt="Smile One Icon" width="24" />
      </div>
      <div onClick={() => handleRatingClick("Bad")}>
        <img src={SmileyTwoIcon} alt="Smile Two Icon" width="24" />
      </div>
      <div onClick={() => handleRatingClick("Average")}>
        <img src={SmileyThreeIcon} alt="Smile Three Icon" width="24" />
      </div>
      <div onClick={() => handleRatingClick("Good")}>
        <img src={SmileyFourIcon} alt="Smile Four Icon" width="24" />
      </div>
      <div onClick={() => handleRatingClick("Excellent")}>
        <img src={SmileyFiveIcon} alt="Smile Five Icon" width="24" />
      </div>
      <FeedbackModal show={showModal} handleClose={handleCloseModal} rating={selectedRating} />
    </div>
  );
};
 
export default SmileyIcons;