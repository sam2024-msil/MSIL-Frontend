import { Form } from "react-bootstrap";
import styles from './Chatbot/Chatbot.module.scss';
import SendIcon from '../../assets/send-icon.svg';
import StopCircleIcon from '../../assets/stop-circle.svg';
import { useEffect, useRef, useState } from "react";
import newChatIcon from '../../assets/new-chat-icon.svg';
import chatToggleIcon from '../../assets/menu_icon.svg'
import { isMobileDevice } from "../../utils/BroswerUtil";


interface InputPros {
    getInput: (query:string) => void;
    showStopButton: boolean;
    onStop: () => void;
    clearChatWindow: () => void;
}
const ChatInput = ({ getInput, showStopButton, onStop, clearChatWindow }:InputPros) => {

    const [query, setQuery] = useState<string>('');
    const inputElem = useRef<HTMLInputElement>(null);
    const [disableAsk, setDiableAsk] = useState<boolean>(false)

    useEffect(() => {
      if (!isMobileDevice() && (!showStopButton)) {
        inputElem.current?.focus();
      }
      
    }, [showStopButton]);

    useEffect(() => {
      if(query || showStopButton) {
        setDiableAsk(false);
      } else {
        setDiableAsk(true)
      }
    },[query, showStopButton])
    const handleSend = () => {
      if(!showStopButton) {
        getInput(query);
        setQuery('');
      } else {
        onStop();
      }
    }

    const clearChat = () => {
      clearChatWindow();
    }

    return(
        <Form className="mt-3" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <Form.Group controlId="chatInput" className={`${styles.chatInput} d-flex`}>
            <div className="btn-group dropup">
                <button type="button" className={`${styles.chatToggleButton} btn btn-outline-primary dropdown-toggle`} data-bs-toggle="dropdown" aria-expanded="false">
                  <img src={chatToggleIcon} alt="Chat Toggle Icon" />
                </button>
                <ul className="dropdown-menu">
                  <li onClick={clearChat}><a className="dropdown-item"><span className="me-2"><img src={newChatIcon} alt="New Chat Icon" /></span>New Chat</a></li>
                  {/* <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item"><span className="me-2"><img src={HistoryIcon} alt="History Icon" /></span>History</a></li> */}
                </ul>
              </div>
              <Form.Control
                ref={inputElem}
                type="text"
                placeholder="Type your query here"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`${styles['chat-textbox']}`}
                autoComplete="off"
                maxLength={250}
              />
              <button type="submit" className={`${styles.chatInputButton} btn-primary float-end`}
              disabled={disableAsk}
              >
                {(!showStopButton) ? <img src={SendIcon} alt="Send Icon" width='20' /> : <img src={StopCircleIcon} alt="Stop Icon" width='20' /> }
                {/* <img src={SendIcon} alt="Send Icon" width="20" /> */}
              </button>
            </Form.Group>
          </Form>
    )
}

export default ChatInput;