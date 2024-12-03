import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaRegSmile, FaRegFilePdf } from 'react-icons/fa';
import styles from './Chatbot.module.scss';

type MessageType = {
  text: string;
  time: string;
  type: 'question' | 'answer';
};

const defaultQA = [
  { question: 'What is your name?', answer: 'I am a chatbot created to assist you.' },
  { question: 'How can you help me?', answer: 'I can answer your questions and provide information.' },
  { question: 'What services do you offer?', answer: 'I offer a variety of services including answering questions and providing information.' },
  { question: 'Where are you located?', answer: 'I am a virtual assistant, so I am available everywhere!' },
];

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    { text: 'What is your name?', time: new Date().toLocaleTimeString(), type: 'question' },
    { text: 'I am a chatbot created to assist you.', time: new Date().toLocaleTimeString(), type: 'answer' },
    { text: 'How can you help me?', time: new Date().toLocaleTimeString(), type: 'question' },
    { text: 'I can answer your questions and provide information.', time: new Date().toLocaleTimeString(), type: 'answer' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: MessageType = {
        text: input,
        time: new Date().toLocaleTimeString(),
        type: 'question',
      };
      setMessages([...messages, newMessage]);
      setInput('');

      // Find the corresponding answer
      const foundQA = defaultQA.find(qa => qa.question.toLowerCase() === input.trim().toLowerCase());
      const responseText = foundQA ? foundQA.answer : 'Sorry, I do not understand the question.';

      // Simulate a response
      setTimeout(() => {
        const responseMessage: MessageType = {
          text: responseText,
          time: new Date().toLocaleTimeString(),
          type: 'answer',
        };
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
      }, 1000);
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className={`${styles.chatWindow} border p-3`}>
            {messages.map((msg, index) => (
              <div key={index} className={`d-flex ${msg.type === 'question' ? 'justify-content-end' : 'justify-content-start'}`}>
                <div className={`${styles.message} ${msg.type === 'question' ? styles.question : styles.answer}`}>
                  <div>{msg.text}</div>
                  <div className="d-flex justify-content-between align-items-center mt-1">
                    <small className="text-muted">{msg.time}</small>
                    {msg.type === 'answer' && (
                      <div>
                        <FaRegSmile className="mx-1" />
                        <FaRegFilePdf className="mx-1" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Form className="mt-3" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <Form.Group controlId="chatInput">
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              Send
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Chatbot;