import Modal from 'react-bootstrap/Modal';
import { TypeReview } from '../../../type/CustomTypes';
import styles from './FeedbackViewer.module.scss';
import SmileyOneIcon from '../../../assets/SmileyIcons/SmileyOneIcon.svg';
import SmileyTwoIcon from '../../../assets/SmileyIcons/SmileyTwoIcon.svg';
import SmileyThreeIcon from '../../../assets/SmileyIcons/SmileyThreeIcon.svg';
import SmileyFourIcon from '../../../assets/SmileyIcons/SmileyFourIcon.svg';
import SmileyFiveIcon from '../../../assets/SmileyIcons/SmileyFiveIcon.svg';
import SmileyOneSelected from '../../../assets/SmileyIcons/SmileyOneSelectedIcon.svg';
import SmileyTwoSelected from '../../../assets/SmileyIcons/SmileyTwoSelectedIcon.svg';
import SmileyThreeSelected from '../../../assets/SmileyIcons/SmileyThreeSelectedIcon.svg';
import SmileyFourSelected from '../../../assets/SmileyIcons/SmileyFourSelectedIcon.svg';
import SmileyFiveSelected from '../../../assets/SmileyIcons/SmileyFiveSelectedIcon.svg';
import RightArrowIcon from '../../../assets/RightLongArrowIcon.svg';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axios';

interface FeedbackViewerProps {
    isOpen?: boolean;
    data: TypeReview;
    onClose: () => void;
}

const FeedbackViewer = ({ isOpen, data, onClose }: FeedbackViewerProps) => {

    const [feedbackCategory, setFeedbackCategory] = useState<any>();

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
        getFeedbackCategory();
      },[])

    return (
        <>
            <Modal show={isOpen} onHide={onClose} closeButton={true} size="sm" centered>
                <Modal.Header closeButton className={styles['modal-header']}>

                </Modal.Header>
                <Modal.Body className='pt-0'>
                    <div className={styles['content-block']}>
                        <div className={styles['emotion-block']}>
                            <div className="reaction-icons reaction-icons-modal d-flex justify-content-center">
                                <div className="icon">
                                    {(data?.rating === 1) ? <img src={SmileyOneSelected} alt="Smile One Icon" width="24" /> : <img src={SmileyOneIcon} alt="Smile One Icon" width="24" />}
                                </div>
                                <div className="icon">
                                    {(data?.rating === 2) ? <img src={SmileyTwoSelected} alt="Smile One Icon" width="24" /> : <img src={SmileyTwoIcon} alt="Smile Two Icon" width="24" />}
                                </div>
                                <div className="icon">
                                    {(data?.rating === 3) ? <img src={SmileyThreeSelected} alt="Smile One Icon" width="24" /> : <img src={SmileyThreeIcon} alt="Smile Three Icon" width="24" />}
                                </div>
                                <div className="icon">
                                    {(data?.rating === 4) ? <img src={SmileyFourSelected} alt="Smile One Icon" width="24" /> : <img src={SmileyFourIcon} alt="Smile Four Icon" width="24" />}
                                </div>
                                <div className="icon">
                                    {(data?.rating === 5) ? <img src={SmileyFiveSelected} alt="Smile One Icon" width="24" /> : <img src={SmileyFiveIcon} alt="Smile Five Icon" width="24" />}
                                </div>
                            </div>
                        </div>
                        {!!data?.options?.length && (
                            <div className={styles['options-block']}>
                                {data?.options.map((optionKey) => {
                                    const selectedOption = feedbackCategory?.feedbackCategories?.find((e: any) => e.rating === data?.rating).options;
                                    const selectedLabel = selectedOption?.find((k: any) => k.key === optionKey);
                                    return (
                                        <div className={styles['option-item']} key={`option-key-${optionKey}`}>
                                            <img src={RightArrowIcon} width={20} height={15} />
                                            {selectedLabel?.label}
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {data?.message && (
                            <div className={styles['message-block']}>
                                <h6>
                                    Your Comments
                                </h6>
                                <p>{data.message}</p>
                            </div>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default FeedbackViewer;