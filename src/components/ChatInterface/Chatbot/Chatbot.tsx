import { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import Markdown from 'react-markdown';
import rehypeRaw from "rehype-raw";
// import { Modal } from 'react-bootstrap';
import Feedback from '../../Feedback/Feedback';
import pdfIcon from '../../../assets/pdfIcon.svg';
import msilLogo from '../../../assets/MSIL-icon.png';
import styles from './Chatbot.module.scss';
import DotLoader from "../../../lib/DotLoader";
import FeedbackViewerIcon from '../../../assets/ViewFeedbackIcon.svg';
import { isAppreciationOrgratitudeMessage, isGreetingMessage, isOutofScopeMessage } from "../../../utils/MessageUtil";
import Loader from '../../Spinner/Spinner';
import { TypeReview } from '../../../type/CustomTypes';
import { API_STATUS } from '../../../constants/ApiConstants';
import DateUtil from '../../../utils/DateUtil';
import axiosInstance from '../../../api/axios';
import FeedbackViewer from '../../Feedback/FeedbackViewer/FeedbackViewer';
 

interface InteractionViewerProps {
  userMessage: any;
  botResponseLoadingStatus: string;
  conversations: any;
  index: number;
  assistantMessage: any;
  interactionId: string;
  review?: TypeReview;
  isStreaming?: boolean;
  isOffline?:  boolean;
}
 
const Chatbot = ({ userMessage,index, assistantMessage, botResponseLoadingStatus, isOffline, conversations, isStreaming, review, interactionId }: InteractionViewerProps) => {
  
  const { showSuccess, showError } = useToast();  

  const [displayReview, setDisplayReview] = useState(review);
  const [showGivenFeedback, setShowGivenFeedback] = useState(false);
  const [loader, setLoader] = useState<boolean>(false);
  
  const hadleHideFeedbackButtonClick = () => setShowGivenFeedback(false);
  const hadleShowFeedbackButtonClick = () => setShowGivenFeedback(true);
  const onFeedbackSubmit = (rating: number, options: Array<number>, message: string, currentInteractionId: string, showModal: (param: boolean) => void) => {
    setLoader(true);
    axiosInstance.post(`/feedback/`, { rating: rating, feedback: message, options: options,interaction_id: currentInteractionId,user_mail:'sam@gmail.com'})
        .then((res) => {
            if (res?.data) {
                setDisplayReview({ rating: rating, options: options, message: message });
                showSuccess('Feedback submitted successfully');
                showModal(false);
            }
            setLoader(false);
        }).catch((e) => {
            console.log(e);
            showError('Feedback is not submitted.');
            setLoader(false);
        })
}

const previewDoc = (docName:string) => {
  if(docName) {
    setLoader(true);
    axiosInstance.get(`/preview-citation?doc_name=${docName}&page_num=1`)
    .then((res) => {
      if(res.data) {
        setLoader(false);
      }
    }).catch((e) =>{
      console.error(e);
      setLoader(false);
    })
  }
}

  return (
            <>
              <div key={index}>
                {/* {msg.date && (index === 0 || messages[index - 1].date !== msg.date) && (
                  <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1"><hr className={`${styles['hrBorderColor']}`} /></div>
                    <h5 className={`${styles['dateSection']} mx-3`}>{msg.date}</h5>
                    <div className="flex-grow-1"><hr className={`${styles['hrBorderColor']}`} /></div>
                  </div>
                )} */}
                <div className={`d-flex px-3  ${userMessage?.role === 'user' ? 'flex-column align-items-end' : 'flex-row align-items-start my-3'} `}>
                    <div className="d-flex flex-column align-items-end">
                      <div className={`${styles.message} ${styles.question}`}>
                        <div>{userMessage?.content?.text}</div>
                      </div>
                    </div>

                    {/* Assistant response */}
                    
                    <div className="d-flex align-items-start w-100 my-3">
                      <div className={`${styles.userIcon} me-2`}><img src={msilLogo} alt="User Icon" /></div>
                      <div className="w-100">
                      {(loader) && <Loader />}
                    {(botResponseLoadingStatus === API_STATUS.PROGRESS && !isOffline && conversations.length === index + 1) && <DotLoader />}
                    {(botResponseLoadingStatus === API_STATUS.PROGRESS && isOffline && conversations.length === index + 1) && 
                    <div className={styles['connection-error']}>
                        Uh oh! I'm experiencing connectivity issues at moment. Can you please try again after a while?
                    </div>
                    }
                    {assistantMessage?.content && (
                      <>
                        <div className={`${styles.message} ${styles.answer} w-100`}>
                          <div>
                          <Markdown rehypePlugins={[rehypeRaw]}>{assistantMessage.content.text}</Markdown>
                          </div>
                          <div className="d-flex justify-content-start mt-2">
                          {(assistantMessage?.images?.length > 0) && assistantMessage?.images.map((image:string,index:number) => {
                            return(
                              <img src={image} key={index} className={'img-fluid'} />
                            )
                          })}
                          </div>
                          {(assistantMessage?.document_name) &&
                          <div className="d-flex justify-content-start mt-2">
                            <button className={`${styles['pdf-btn']} btn btn-outline-primary`} onClick={() => previewDoc(assistantMessage?.document_name)}>
                              <img src={pdfIcon} alt="PDF Icon" /><span className='ms-2'>{assistantMessage?.document_name}</span>
                            </button>
                          </div>
                          }
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                        {!isStreaming &&
                                    !isGreetingMessage(assistantMessage?.intent) &&
                                    !isOutofScopeMessage(assistantMessage?.intent) &&
                                    !isAppreciationOrgratitudeMessage(assistantMessage?.intent) &&
                                    assistantMessage.content.text && (
                                      <Feedback onFeedbackSubmit={onFeedbackSubmit} interactionId={interactionId} givenRating={displayReview?.rating} />
                        )}
                        {/* Feedback viewer icon */}
                        {!!displayReview?.rating && (
                                    <div className={styles.feedbackViewer}>
                                        <img src={FeedbackViewerIcon} onClick={hadleShowFeedbackButtonClick} title='Feedback viewer'/>
                                    </div>
                                )}

                            {displayReview && (<FeedbackViewer isOpen={showGivenFeedback} data={displayReview} onClose={hadleHideFeedbackButtonClick} />)}
                          <small className={`${styles['text-muted']} w-100 text-end`}> 
                          {(assistantMessage?.timestamp) && DateUtil.formatChatResponseDate(assistantMessage?.timestamp)}
                          </small>
                        </div>
                        </>
                        )}
                      </div>
                    </div>
                </div>
              </div>
            

        {/* <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
                <Modal.Header closeButton>
                  <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <iframe
                    src={PDFFile}
                    width="100%"
                    height="450px"
                    title="PDF Viewer"
                  ></iframe>
                </Modal.Body>
              </Modal> */}
              </>
          
  );
};
 
export default Chatbot;