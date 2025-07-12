// components/MessageList.jsx
import { useEffect, useRef } from 'react';

const MessageList = (messages) => {
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(message => (
        <div key={message.id} className="flex items-start gap-3">
          <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center">
            {message.sender.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{message.sender.name}</span>
              <span className="text-gray-400 text-xs">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {message.mediaType === 'TEXT' ? (
              <p className="mt-1 text-gray-300">{message.content}</p>
            ) : (
              <a 
                href={message.fileUrl} 
                className="mt-1 inline-flex items-center text-blue-400 hover:text-blue-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {message.fileName}
              </a>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;