
export type TypeReference = {
    label: string;
    url: string;
    articleId?: string;
};


export type TypeChatMessage = {
    conversationId?: string;
    interactionId?: string;
    intent?: string | Array<string>;
    content: {
        text: string;
    };
    references?: Array<TypeReference>;
    role?: string;
    timestamp?: number;
    images?: string;
    document_name?: string;
    pageNum?: string;
};

export type TypeReview = {
    rating: number;
    message?: string;
    options?: Array<number>;
};

export type TypeConversation = {
    interactionId?: string;
    messages: Array<TypeChatMessage>;
    review?: TypeReview;
    timestamp?: Date;
};


export type TypeResponseErrorMessage = {
    key: string;
    value: string;
    message?: string;
};