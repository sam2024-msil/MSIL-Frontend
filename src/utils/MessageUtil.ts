import { INTENT_TYPES } from "../config/MessageConfig";


const validateIntent = (intent: undefined | string | Array<string>, type: string) => {
    switch (typeof intent) {
        case 'string':
            return intent === type;
        case 'object':
            return intent.includes(type) && intent.length === 1;
        default:
            return false;
    }
};

const isGreetingMessage = (intent: undefined | string | Array<string>) => {
    return validateIntent(intent, INTENT_TYPES.greeting);
};

const isOutofScopeMessage = (intent: undefined | string | Array<string>) => {
    return validateIntent(intent, INTENT_TYPES.out_of_scope);
};

const isAppreciationOrgratitudeMessage = (intent: undefined | string | Array<string>) => {
    return validateIntent(intent, INTENT_TYPES.appreciation_or_gratitude);
};

export {
    isOutofScopeMessage,
    isGreetingMessage,
    isAppreciationOrgratitudeMessage
}