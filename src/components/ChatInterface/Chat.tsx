import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './chat.module.scss';
import Chatbot from './Chatbot/Chatbot';
import disclaimerIcon from '../../assets/disclaimer-icon.svg';
import { useToast } from '../../context/ToastContext';
import AppStateUtil from '../../utils/AppStateUtil';
import { Col, Container, Row } from 'react-bootstrap';
import ChatInput from './ChatInput';
import { TypeChatMessage, TypeConversation, TypeResponseErrorMessage } from '../../type/CustomTypes';
import { useAskQuestionHandler } from '../../hooks/ChatResponseHooks';
import { API_STATUS } from '../../constants/ApiConstants';
import { CHAT_CONSTANTS } from '../../constants/ChatConstants';
import ChatApi from '../../ChatApi/ChatApi';
import ChatClearPopup from './ChatClearPopup/ChatClearPopup';
import Markdown from 'react-markdown';
import rehypeRaw from "rehype-raw";
import axiosInstance from '../../api/axios';

const Chat: React.FC = () => {

    const { showSuccess, showError } = useToast();
    const [isVendorLoggedIn, setIsVendorLoggedIn] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<number>(0);
    const [prompt, setPrompt] = React.useState<string>('');
    const [conversations, setConversations] = React.useState<Array<TypeConversation>>([]);
    const [messagesCount, setMessagesCount] = React.useState<number>(0);
    const [botResponseLoadingStatus, setBotResponseLoadingStatus] = React.useState<string>(
        API_STATUS.INITIAL
    );
    const [isOffline, setIsOffline] = useState<boolean>();
    const [responseErrorData, setResponseErrorData] = React.useState<TypeResponseErrorMessage | null>(null);
    const [showClearChatPopup, setShowClearChatPopup] = useState<boolean>(false);
    const [welcomeMsg, setWelcomeMsg] = useState<string>('');

    const chatApi = useMemo(() => new ChatApi(), []);

    const chatWindowRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
          }
    }, [conversations])

    useEffect(() => {
        setIsVendorLoggedIn(AppStateUtil.isVendorLoggedIn());
        setUserRole(AppStateUtil.getRoleDetails());
    }, [])

    const handleNetworkConnectionStatusChange = (e: Event) => {
        const offlineStatus = e.type === 'offline';
        if (offlineStatus) {
            showError('Internet connection lost');
        } else {
            showSuccess('Internet connection restored');
            
        }
        setIsOffline(offlineStatus);
      };
    
      useEffect(() => {
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
          setIsOffline(!navigator.onLine);
          window.addEventListener('offline', handleNetworkConnectionStatusChange);
          window.addEventListener('online', handleNetworkConnectionStatusChange);
          return () => {
            window.removeEventListener('offline', handleNetworkConnectionStatusChange);
            window.removeEventListener('online', handleNetworkConnectionStatusChange);
          };
        }
      }, []);

    const getInput = (input: string) => {
        if (input.trim() === '') return;

        if (input.trim()) {
            setPrompt(input.trim());
            setConversations((prevConversations) => {
                const updated = [
                    ...prevConversations,
                    {
                        messages: [
                            {
                                role: 'user',
                                content: {
                                    text: input,
                                },
                                timestamp: Date.now(),
                            },
                        ],
                    },
                ];
                setMessagesCount(updated.length);

                return updated;
            });
        }
    }

    const handleStopStreamButtonClick = async () => {
        if (botResponseLoadingStatus === API_STATUS.STREAMING || botResponseLoadingStatus === API_STATUS.PROGRESS) {
          await chatApi.terminateStreaming();
          setBotResponseLoadingStatus(API_STATUS.SUCCESS);
        }
        setBotResponseLoadingStatus(API_STATUS.SUCCESS);
      };

    useAskQuestionHandler(
        messagesCount,
        prompt,
        conversations,
        setBotResponseLoadingStatus,
        setConversations,
        setResponseErrorData
    )

    const clearChatWindow = () => {
        setShowClearChatPopup(true);
    }
    console.log(" responseErrorData :: ", responseErrorData)

    const closeClearModal = (decision:boolean) => {
        if(decision) {
            setConversations([]);
        }
        setShowClearChatPopup(false)
    }

    const getFeedbackCategory = () => {
        axiosInstance.get(`/feedback-categories`)
        .then((res) => {
          if(res) {
            setWelcomeMsg(res?.data?.chatWelcomeMessage);
          }
        }).catch((e) => {
          console.log(e)
        })
    }

    useEffect(() => {
        getFeedbackCategory();
    },[])

    return (
        <div className={`${styles['right-content-section']}`}>
            <div className='row'>
                {(!isVendorLoggedIn && userRole === 1) &&
                    <div className={`col-md-2`}>   
                        <div className={`${styles['right-main-heading']}`}>
                            <h5>Chat</h5>
                        </div>
                    </div>
                }
                <div className={(!isVendorLoggedIn && userRole === 1) ? `col-md-8` : 'col-md-12'}> 
                    <div className={(isVendorLoggedIn || userRole === 2) ? styles['vendor-chat-window-bg'] : ''}> 
                        <Container className="mt-4">
                            <Row>
                                <Col>
                                <div className="card mb-2 border-0">
                                    <div className="card-body">
                                    <Markdown rehypePlugins={[rehypeRaw]}>{welcomeMsg}</Markdown>
                                    </div>
                                </div>
                                    <div ref={chatWindowRef} className={`${styles.chatWindow}`}>
                                        {conversations.map((conversation: TypeConversation, index: number) => {

                                            const { messages = [], interactionId } = conversation;
                                            const userMessage = messages.find(({ role }: TypeChatMessage) => role === 'user');
                                            const assistantMessage: any = messages.find(({ role }: TypeChatMessage) => role === 'assistant');
                                                if (botResponseLoadingStatus === API_STATUS.FAILURE && assistantMessage?.role === 'assistant') {
                                                    showError(CHAT_CONSTANTS.something_went_wrong);
                                                }
                                            const isLastMesage = conversations.length - 1 == index;
                                            const isStreaming = isLastMesage && botResponseLoadingStatus === API_STATUS.STREAMING;
                                            return (
                                                <>
                                                    <Chatbot
                                                        userMessage={userMessage}
                                                        botResponseLoadingStatus={botResponseLoadingStatus}
                                                        conversations={conversations}
                                                        index={index}
                                                        assistantMessage={assistantMessage}
                                                        interactionId={interactionId || assistantMessage?.interactionId}
                                                        review={assistantMessage?.review}
                                                        isStreaming={isStreaming}
                                                        isOffline={isOffline}
                                                    />
                                                </>
                                            )
                                        })}
                                    </div>
                                    <ChatInput 
                                    getInput={getInput}
                                    showStopButton={
                                        botResponseLoadingStatus === API_STATUS.STREAMING ||
                                        botResponseLoadingStatus === API_STATUS.PROGRESS
                                      }
                                    onStop={handleStopStreamButtonClick}
                                    clearChatWindow={clearChatWindow}
                                     />
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    <p className={`${styles['disclaimer-message']}`}> <span className='me-2'><img src={disclaimerIcon} alt='Disclimer'/> </span>The information provided in this chat is for general informational purposes</p>
                </div>
            </div>
            <ChatClearPopup show={showClearChatPopup} handleClose={closeClearModal} />
        </div>
    );
};

export default Chat;