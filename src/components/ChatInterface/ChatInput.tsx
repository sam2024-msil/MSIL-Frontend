import { Form } from "react-bootstrap";
import styles from './Chatbot/Chatbot.module.scss';
import SendIcon from '../../assets/send-icon.svg';
// import StopCircleIcon from '../../assets/stop-circle.svg';
import { useEffect, useRef, useState } from "react";
import { isMobileDevice } from "../../utils/BroswerUtil";


interface InputPros {
    getInput: (query:string) => void;
    showStopButton?: boolean;
    onStop: () => void;
}
const ChatInput = ({ getInput, showStopButton, onStop }:InputPros) => {

    const [query, setQuery] = useState<string>('');
    const inputElem = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!isMobileDevice() && (!showStopButton)) {
        inputElem.current?.focus();
      }
  
    }, [showStopButton]);

    const handleSend = () => {
      if(true) {
        getInput(query);
        setQuery('');
      } else {
        onStop();
      }
    }

    return(
        <Form className="mt-3" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <Form.Group controlId="chatInput" className={`${styles.chatInput}`}>
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
              disabled={showStopButton}
              >
                {/* {(!showStopButton) ? <img src={SendIcon} alt="Send Icon" width='20' /> : <img src={StopCircleIcon} alt="Stop Icon" width='20' /> } */}
                <img src={SendIcon} alt="Send Icon" width="20" />
              </button>
            </Form.Group>
          </Form>
    )
}

export default ChatInput;