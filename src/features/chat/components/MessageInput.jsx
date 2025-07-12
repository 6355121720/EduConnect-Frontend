// components/MessageInput.jsx
import { useState } from 'react';
import { PaperClipIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const MessageInput = ({ group, currentUser, setMessages }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setMessage('');
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full bg-gray-700 rounded-lg py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="absolute right-3 top-2.5 cursor-pointer">
          <input type="file" className="hidden" onChange={handleFileChange} />
          <PaperClipIcon className="w-5 h-5 text-gray-400 hover:text-white" />
        </label>
      </div>
      <button
        type="submit"
        disabled={!message && !file}
        className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg p-2"
      >
        <PaperAirplaneIcon className="w-5 h-5" />
      </button>
    </form>
  );
};

export default MessageInput;