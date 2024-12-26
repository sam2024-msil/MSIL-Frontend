const MESSAGE_ROLES = {
    user: 'user',
    assistant: 'assistant',
};

const STREAM_ITEM_TYPE = {
    message: 'message',
    end: 'end',
    interactionId: 'interactionId',
    intent: 'intent',
    references: 'references',
    search_query: 'search_query',
    dateTime: 'dateTime',
    images: 'images',
    document_name: 'document_name',
    pageNum: 'pageNum',
};

const INTENT_TYPES = {
    greeting: 'greeting',
    out_of_scope: 'out_of_scope',
    appreciation_or_gratitude: 'appreciation_or_gratitude',
};

export { MESSAGE_ROLES, STREAM_ITEM_TYPE, INTENT_TYPES };