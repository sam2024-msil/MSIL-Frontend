import React from 'react';
import styles from './chat.module.scss';
import Chatbot from './Chatbot/Chatbot';

const Chat: React.FC = () => {
    return (

        <div className={`${styles['right-content-section']}`}>
            <div className='row'>
                <div className='col-md-2'>   {/*  nned to write the condition if the vendor  is logged in nee to remove this div and chat header*/}
                    <div className={`${styles['right-main-heading']}`}>
                        <h5>Chat</h5>
                    </div>
                </div>
                <div className='col-md-8'> {/* here too write the condition to change from col-md-8 to col-md-12 */}
                    <div className={`${styles['vendor-chat-window-bg']}`}>  {/** Need to add condition for this class name */}  
                        <Chatbot />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;