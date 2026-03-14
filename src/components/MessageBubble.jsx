import React from 'react';

export default function MessageBubble({ message }) {
  const { role, text, timestamp } = message;
  const isUser = role === 'user';
  
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'bot'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div>
        <div className="message-bubble">
          {text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i !== text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
        <div className="message-time">{formattedTime}</div>
      </div>
    </div>
  );
}
