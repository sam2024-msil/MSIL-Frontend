import React from 'react';
import styles from './chat.module.scss';
import Chatbot from './Chatbot/Chatbot';

const Chat: React.FC = () => {
    return (

        <div className={`${styles['right-content-section']}`}>
            <div className='row'>
                <div className='col-md-2'>
                    <div className={`${styles['right-main-heading']}`}>
                        <h5>Chat</h5>
                    </div>
                </div>
                <div className='col-md-8'>
                    <div>
                        <Chatbot />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;