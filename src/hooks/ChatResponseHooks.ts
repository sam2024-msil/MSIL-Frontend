import { useEffect, useState } from 'react';
import { TypeConversation, TypeResponseErrorMessage } from '../type/CustomTypes';
import { API_STATUS } from '../constants/ApiConstants';
import { MESSAGE_ROLES, STREAM_ITEM_TYPE } from '../config/MessageConfig';
import ChatApi from '../ChatApi/ChatApi';


const handleStreamResponseData = (
    data: any,
    conversations: Array<TypeConversation>,
    setConversations: (data: Array<TypeConversation>) => void,
) => {
    if (data) {

        const conversationHistory = [...conversations];
        const allMessages = conversationHistory[conversationHistory.length - 1]?.messages;
        if (allMessages) {
            let assistantMessage 
            assistantMessage = allMessages.slice(-1).find((v) => v.role === 'assistant');
            if (data?.type === STREAM_ITEM_TYPE.message) {
                if (!assistantMessage) {
                    conversationHistory[conversationHistory.length - 1].messages.push({
                        role: MESSAGE_ROLES.assistant,
                        content: {
                            text: data.content,
                        },
                    });
                } else {
                    if (data.content !== null) {
                        assistantMessage.content.text += data.content;
                    }

                }
            }
            if (data.type === STREAM_ITEM_TYPE.interactionId) {
                if (!assistantMessage) {
                    conversationHistory[conversationHistory.length - 1].messages.push({
                        role: MESSAGE_ROLES.assistant,
                        interactionId: data.content,
                        content: {
                            text: '',
                        },
                    });
                } else {
                    assistantMessage.interactionId = data.content;
                }
            }
            if (data.type === STREAM_ITEM_TYPE.dateTime) {
                if (!assistantMessage) {
                    conversationHistory[conversationHistory.length - 1].messages.push({
                        role: MESSAGE_ROLES.assistant,
                        timestamp: data.content,
                        content: {
                            text: '',
                        },
                    });
                } else {
                    assistantMessage.timestamp = data.content;
                }
            }

            if (
                data?.type === STREAM_ITEM_TYPE.references &&
                assistantMessage &&
                typeof JSON.parse(data.content) !== 'string'
            ) {
                assistantMessage.references = JSON.parse(data.content);
            }
            
            if (data?.type == STREAM_ITEM_TYPE.intent && assistantMessage) {
                assistantMessage.intent = data?.content;
            }
            setConversations(conversationHistory);
        }
    }
};

const useAskQuestionHandler = (
    messagesCount: number,
    prompt: string,
    conversations: Array<TypeConversation>,
    setBotResponseLoadingStatus: (data: string) => void,
    setConversations: (data: Array<TypeConversation>) => void,
    setResponseErrorData: (data: TypeResponseErrorMessage | null) => void
) => {
    const [retryAskQuestion, setRetryAskQuestion] = useState(false);

    const handleAskQuestion = async (
        prompt: string,
        conversations: Array<TypeConversation>,
        setBotResponseLoadingStatus: (data: string) => void,
        setConversations: (data: Array<TypeConversation>) => void,
        setRetryAskQuestion: (data: boolean) => void,
        setResponseErrorData: (data: TypeResponseErrorMessage | null) => void,
    ) => {
        setBotResponseLoadingStatus(API_STATUS.PROGRESS);

        try {
            const chatApi = new ChatApi();
            await chatApi.askQuestion(
                prompt,
                'stream',
                async (stream) => {
                    const data:any = JSON.parse(stream);
                    setResponseErrorData(null);

                    if (data.error) {
                        if (data.status === 401) {
                            try {
                                setRetryAskQuestion(true);
                            } catch (tokenError) {
                                setBotResponseLoadingStatus(API_STATUS.FAILURE);
                            }
                        } else if (data.status === 429) {
                            setResponseErrorData(data.content || null);
                            setBotResponseLoadingStatus(API_STATUS.FAILURE);
                        } else {
                            setBotResponseLoadingStatus(API_STATUS.FAILURE);
                        }
                        return;
                    }
                    
                    if (data) {
                        handleStreamResponseData(data, conversations, setConversations);
                    }

                    switch (data.type) {
                        case STREAM_ITEM_TYPE.message:
                            setBotResponseLoadingStatus(API_STATUS.STREAMING);
                            break;

                        case STREAM_ITEM_TYPE.end:
                            setBotResponseLoadingStatus(API_STATUS.SUCCESS);
                            chatApi.sseController.abort();
                            break;

                        case STREAM_ITEM_TYPE.interactionId:
                            chatApi.interactionId = data.content;
                            // setLastInteractionId(data.content);
                            break;

                        case STREAM_ITEM_TYPE.search_query:
                            // setBotSearchQueries(data.content);
                            break;
                    }
                }
            );
        } catch (e) {
            setBotResponseLoadingStatus(API_STATUS.FAILURE);
        }


    };

    useEffect(() => {

        if (messagesCount) {
            handleAskQuestion(
                prompt,
                conversations,
                setBotResponseLoadingStatus,
                setConversations,
                setRetryAskQuestion,
                setResponseErrorData
            );
        }
    }, [messagesCount]);

    useEffect(() => {
        if (retryAskQuestion && messagesCount) {
            setRetryAskQuestion(false);
            handleAskQuestion(
                prompt,
                conversations,
                setBotResponseLoadingStatus,
                setConversations,
                setRetryAskQuestion,
                setResponseErrorData
            );
        }
    }, [retryAskQuestion]);
};

export { useAskQuestionHandler };