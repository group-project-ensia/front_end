import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string; timestamp: string }[]>(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const createChat = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: '67f44b53f0db698b1023c192',
            messages: []
          })
        });
        const data = await response.json();
        setChatId(data._id);
      } catch (error) {
        console.error('Failed to create chat:', error);
      }
    };

    createChat();
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatId) return;

    const timestamp = new Date().toLocaleTimeString();
    const userMessage = { role: 'user' as const, text: input, timestamp };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`http://localhost:5000/api/chats/${chatId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });

      const data = await response.json();
      const botReply = data.messages[data.messages.length - 1].text;
      const botMessage = { role: 'bot' as const, text: botReply, timestamp: new Date().toLocaleTimeString() };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleClear = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="chat-main-content">
      <header className="chat-header">
        <span>AI Chat Assistant</span>
        <button className="chat-clear-button" onClick={handleClear}>Clear Chat</button>
      </header>

      <div className="chat-content">
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role === 'user' ? 'chat-user-message' : 'chat-bot-message'}`}>
                <div className="chat-text-block">{msg.text}</div>
                <div className="chat-message-meta">
                  <span className="chat-avatar">{msg.role === 'user' ? '🧑' : '🤖'}</span>
                  <span className="chat-timestamp">{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message chat-bot-message chat-typing-indicator">Typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <input
              className="chat-input-field"
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="chat-send-button vibrant
            " onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
