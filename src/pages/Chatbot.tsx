import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string; timestamp: string }[]>([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved state on initial render
  useEffect(() => {
  const loadChat = async () => {
    const savedChatId = localStorage.getItem('chatId');
    const savedMessages = localStorage.getItem('chatMessages');

    if (savedChatId && savedMessages) {
      setChatId(savedChatId);
      setMessages(JSON.parse(savedMessages));
    } else {
      await createNewChat(); // Initialize only if no saved data
    }
    setIsLoading(false);
  };

  loadChat();
}, []); // Empty dependency array = runs once on mount

  const createNewChat = async () => {
    try {
      const lectureID = "6823468bdaa7d6ba96d7b110";
      const courseID = "68231fefd0483d35afc6c3e2";
      const userID = "681e66a9a1f352628d8ee50a";

      const contextRes = await fetch(`http://localhost:5000/api/users/${userID}/courses/${courseID}/lectures/${lectureID}/context`);
      const contextData = await contextRes.json();
      const extractedText = contextData.context;

      const prompt = `You are a helpful assistant trained to answer questions based on the following PDF content...

Text:
${extractedText}

Now, feel free to ask me any questions related to the above text.`;

      const response = await fetch('http://localhost:5000/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: courseID,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      setChatId(data._id);
      localStorage.setItem('chatId', data._id);
      
      const initialMessage = { 
        role: 'user' as const, 
        text: prompt, 
        timestamp: new Date().toLocaleTimeString() 
      };
      
      setMessages([initialMessage]);
      localStorage.setItem('chatMessages', JSON.stringify([initialMessage]));
    } catch (error) {
      console.error('Failed to create chat with PDF context:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save messages and chatId whenever they change
  useEffect(() => {
    if (messages.length > 0 || chatId) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      if (chatId) {
        localStorage.setItem('chatId', chatId);
      }
    }
  }, [messages, chatId]);

  const handleSend = async () => {
    if (!input.trim() || !chatId) return;

    const timestamp = new Date().toLocaleTimeString();
    const userMessage = { role: 'user' as const, text: input, timestamp };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
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
      const botMessage = { 
        role: 'bot' as const, 
        text: botReply, 
        timestamp: new Date().toLocaleTimeString() 
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Revert if there's an error
      setMessages(messages);
    } finally {
      setIsTyping(false);
    }
  };
  

  const handleClear = () => {
    setMessages([]);
    setChatId(null);
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('chatId');
    createNewChat(); // Start a fresh chat session
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    handleSend();
  }
};

  // Rest of your component code remains the same...
  // (renderMessageContent, renderMarkdown, and the JSX return)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const renderMessageContent = (text: string) => {
  // First check for LaTeX content
  const latexRegex = /(\$\$?[^$]*\$?\$?)/;
  if (latexRegex.test(text)) {
    // Split by both single $...$ and $$...$$ LaTeX delimiters
    const parts = text.split(latexRegex);
    
    return parts.map((part, idx) => {
      if (!part.trim()) return null;
      
      if (part.startsWith('$') && part.endsWith('$') && part.length > 1) {
        try {
          const math = part.slice(1, -1);
          return <InlineMath key={idx} math={math} />;
        } catch (error) {
          console.error('Error rendering LaTeX:', error);
          return <span key={idx} dangerouslySetInnerHTML={renderMarkdown(part)} />;
        }
      }
      else if (part.startsWith('$$') && part.endsWith('$$') && part.length > 2) {
        try {
          const math = part.slice(2, -2);
          return <BlockMath key={idx} math={math} />;
        } catch (error) {
          console.error('Error rendering LaTeX:', error);
          return <span key={idx} dangerouslySetInnerHTML={renderMarkdown(part)} />;
        }
      }
      return <span key={idx} dangerouslySetInnerHTML={renderMarkdown(part)} />;
    });
  }
  
  // If no LaTeX, just render markdown
  return <span dangerouslySetInnerHTML={renderMarkdown(text)} />;
};
const renderMarkdown = (text: string) => {
  // Simple markdown to HTML conversion
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // italic
    .replace(/\n/g, '<br />'); // line breaks

  return { __html: html };
};

if (isLoading) {
  return (
    <div className="chat-loading-screen">
      <div className="spinner" />
      <p>Loading chat context...</p>
    </div>
  );
}

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
    <div className="chat-text-block">
      {renderMessageContent(msg.text)}
    </div>
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