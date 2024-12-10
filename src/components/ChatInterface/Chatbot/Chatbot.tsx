import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import Feedback from '../../Feedback/Feedback';
import SendIcon from '../../../assets/send-icon.svg';
import pdfIcon from '../../../assets/pdfIcon.svg';
import userIcon from '../../../assets/MSIL-icon.png';
import styles from './Chatbot.module.scss';
import DateUtil from '../../../utils/DateUtil';
import PDFFile from '../../../assets/sample.pdf';
 
type MessageType = {
  text: string;
  time: string;
  type: 'question' | 'answer';
  date?: string;
};
 
const defaultQA = [
  { question: 'What is your name?', answer: 'I am a chatbot created to assist you.' },
  { question: 'How can you help me?', answer: 'I can answer your questions and provide information.' },
  { question: 'What services do you offer?', answer: 'I offer a variety of services including answering questions and providing information.' },
  { question: 'Where are you located?', answer: 'I am a virtual assistant, so I am available everywhere!' },
  { question: 'What is your favorite color?', answer: 'As a chatbot, I don’t have preferences, but I think blue is quite calming.' },
  { question: 'Can you tell me a joke?', answer: 'Sure! Why don’t scientists trust atoms? Because they make up everything!' },
  { question: 'How do I reset my password?', answer: 'To reset your password, go to the settings page and click on "Forgot Password".' },
  { question: 'What is the weather like today?', answer: 'I recommend checking a weather website or app for the most accurate information.' },
];
 
const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [lastDate, setLastDate] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
 
  const handleSend = () => {
    if (input.trim()) {
      const today = new Date();
      const formattedDate = DateUtil.formatDate(today);
      const formattedTime = DateUtil.formatTime(today);
 
      const newMessage: MessageType = {
        text: input,
        time: formattedTime,
        type: 'question',
        date: formattedDate,
      };
 
      setMessages([...messages, newMessage]);
      setInput('');
 
      const foundQA = defaultQA.find(qa => qa.question.toLowerCase() === input.trim().toLowerCase());
      const responseText = foundQA ? foundQA.answer : 'Sorry, I do not understand the question.';
 
      setTimeout(() => {
        const responseMessage: MessageType = {
          text: responseText,
          time: DateUtil.formatTime(new Date()),
          type: 'answer',
          date: formattedDate,
        };
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
      }, 1000);
 
      // Update the last date if it has changed
      if (formattedDate !== lastDate) {
        setLastDate(formattedDate);
      }
    }
  };
 
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);
 
  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div ref={chatWindowRef} className={`${styles.chatWindow}`}>
            {messages.map((msg, index) => (
              <div key={index}>
                {msg.date && (index === 0 || messages[index - 1].date !== msg.date) && (
                  <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1"><hr className={`${styles['hrBorderColor']}`} /></div>
                    <h5 className={`${styles['dateSection']} mx-3`}>{msg.date}</h5>
                    <div className="flex-grow-1"><hr className={`${styles['hrBorderColor']}`} /></div>
                  </div>
                )}
                <div className={`d-flex px-3 ${msg.type === 'question' ? 'flex-column align-items-end' : 'flex-row align-items-start my-3'}`}>
                  {msg.type === 'question' && (
                    <div className="d-flex flex-column align-items-end">
                      <div className={`${styles.message} ${styles.question}`}>
                        <div>{msg.text}</div>
                      </div>
                      <small className="text-muted">{msg.time}</small>
                    </div>
                  )}
                  {msg.type === 'answer' && (
                    <div className="d-flex align-items-start w-100">
                      <div className={`${styles.userIcon} me-2`}><img src={userIcon} alt="User Icon" /></div>
                      <div className="w-100">
                        <div className={`${styles.message} ${styles.answer} w-100`}>
                          <div>{msg.text}</div>
                          <div className="d-flex justify-content-start mt-2">
                            <button className={`${styles['pdf-btn']} btn btn-outline-primary`} onClick={() => setShowModal(true)}>
                              <img src={pdfIcon} alt="PDF Icon" /><span className='ms-2'>SwiftDzire_OwnerManual_Volt.pdf</span>
                            </button>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <Feedback />
                          <small className="text-muted">{msg.time}</small>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Form className="mt-3" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <Form.Group controlId="chatInput" className="d-flex">
              <Form.Control
                type="text"
                placeholder="Type your query here"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`${styles['chat-textbox']}`}
              />
              <Button type="submit">
                <img src={SendIcon} alt="Send Icon" className='w-75' />
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
 
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
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
      </Modal>
    </Container>
  );
};
 
export default Chatbot;