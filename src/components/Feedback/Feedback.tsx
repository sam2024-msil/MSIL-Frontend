import React, { useState } from 'react';
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
 
const SmileyIcons = () => {
  const [selectedRating, setSelectedRating] = useState('');
 
  const handleRatingClick = (rating: string) => {
    setSelectedRating(rating);
    // Optionally, you can send feedback here
    // sendFeedback(rating);
  };
 
  return (
    <div className="smiley-icons">
      <div onClick={() => handleRatingClick("Terrible")}>
        {selectedRating === "Terrible" ? <img src={SmileyOneSelected} alt="Smile One Icon" width="24" /> : <img src={SmileyOneIcon} alt="Smile One Icon" width="24" />}
      </div>
      <div onClick={() => handleRatingClick("Bad")}>
        {selectedRating === "Bad" ? <img src={SmileyTwoSelected} alt="Smile Two Icon" width="24" /> : <img src={SmileyTwoIcon} alt="Smile Two Icon" width="24" />}
      </div>
      <div onClick={() => handleRatingClick("Average")}>
        {selectedRating === "Average" ? <img src={SmileyThreeSelected} alt="Smile Three Icon" width="24" /> : <img src={SmileyThreeIcon} alt="Smile Three Icon" width="24" />}
      </div>
      <div onClick={() => handleRatingClick("Good")}>
        {selectedRating === "Good" ? <img src={SmileyFourSelected} alt="Smile Four Icon" width="24" /> : <img src={SmileyFourIcon} alt="Smile Four Icon" width="24" />}
      </div>
      <div onClick={() => handleRatingClick("Excellent")}>
        {selectedRating === "Excellent" ? <img src={SmileyFiveSelected} alt="Smile Five Icon" width="24" /> : <img src={SmileyFiveIcon} alt="Smile Five Icon" width="24" />}
      </div>
    </div>
  );
};
 
export default SmileyIcons;