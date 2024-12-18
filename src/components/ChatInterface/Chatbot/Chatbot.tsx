import { useEffect, useRef } from 'react';
// import { useToast } from '../../../context/ToastContext';
import Markdown from 'react-markdown';
import rehypeRaw from "rehype-raw";
// import { Modal } from 'react-bootstrap';
import Feedback from '../../Feedback/Feedback';
// import pdfIcon from '../../../assets/pdfIcon.svg';
import msilLogo from '../../../assets/MSIL-icon.png';
import styles from './Chatbot.module.scss';
import DotLoader from "../../../lib/DotLoader";
// import PDFFile from '../../../assets/sample.pdf';
import { isAppreciationOrgratitudeMessage, isGreetingMessage, isOutofScopeMessage } from "../../../utils/MessageUtil";
// import Loader from '../../Spinner/Spinner';
import { TypeReference, TypeReview } from '../../../type/CustomTypes';
import { API_STATUS } from '../../../constants/ApiConstants';
import DateUtil from '../../../utils/DateUtil';
 

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
 
const Chatbot = ({ userMessage,index, assistantMessage, botResponseLoadingStatus, isOffline, conversations, isStreaming }: InteractionViewerProps) => {

  console.log( " isStreaming :: ", isStreaming, " assistantMessage?.intent :: ", assistantMessage?.intent)
  // const { showSuccess, showError } = useToast();  

  // const [displayReview, setDisplayReview] = useState(review);
  // const [showGivenFeedback, setShowGivenFeedback] = useState(false);
    // const [loader, setLoader] = useState<boolean>(false);
  // const [showModal, setShowModal] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  
  var references: Array<TypeReference> = [];
    //References may come in content or message in API response
    if (assistantMessage?.references?.length) {
      references = assistantMessage.references;
    } else if (assistantMessage?.content?.references?.length) {
      references = assistantMessage?.content?.references;
    }
    console.log(" refernces :: ", references);
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, []);
  
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
                      <small className="text-muted">{DateUtil.formatDateAndTime()}</small>
                    </div>

                    {/* Assistant response */}
                    
                    <div className="d-flex align-items-start w-100">
                      <div className={`${styles.userIcon} me-2`}><img src={msilLogo} alt="User Icon" /></div>
                      <div className="w-100">
                      {/* {(loader) && <Loader />} */}
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
                          {/* <div className="d-flex justify-content-start mt-2">
                            <button className={`${styles['pdf-btn']} btn btn-outline-primary`} onClick={() => console.log('t')}>
                              <img src={pdfIcon} alt="PDF Icon" /><span className='ms-2'>SwiftDzire_OwnerManual_Volt.pdf</span>
                            </button>
                          </div> */}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                        {!isStreaming &&
                                    !isGreetingMessage(assistantMessage?.intent) &&
                                    !isOutofScopeMessage(assistantMessage?.intent) &&
                                    !isAppreciationOrgratitudeMessage(assistantMessage?.intent) &&
                                    assistantMessage.content.text && (
                                      <Feedback />
                            )}
                          <small className="text-muted"> 
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