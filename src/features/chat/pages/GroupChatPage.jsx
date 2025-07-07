import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GroupChatPage = () => {
  const navigate = useNavigate();
  const [activeGroup, setActiveGroup] = useState(null);
  const [message, setMessage] = useState('');

  // Sample groups data
  const groups = [
    { id: 1, name: 'Math Study Group', lastMessage: 'Alice: I found this resource...', unread: 3 },
    { id: 2, name: 'Science Project Team', lastMessage: 'Bob: The experiment results...', unread: 0 },
    { id: 3, name: 'Class 10A', lastMessage: 'Teacher: Remember the test tomorrow', unread: 7 },
    { id: 4, name: 'Programming Club', lastMessage: 'Charlie: Let me share my screen', unread: 2 },
  ];

  // Sample messages data
  const groupMessages = {
    1: [
      { id: 1, sender: 'Alice', text: 'I found this resource that might help us', sent: false, time: '2:30 PM' },
      { id: 2, sender: 'You', text: 'Thanks Alice, that looks great!', sent: true, time: '2:35 PM' },
      { id: 3, sender: 'Bob', text: 'Can we go over problem 5 again?', sent: false, time: '2:40 PM' },
    ],
    2: [
      { id: 1, sender: 'Bob', text: 'The experiment results are ready', sent: false, time: '11:15 AM' },
    ],
    // ... other groups' messages
  };

  const handleSendMessage = () => {
    if (message.trim() && activeGroup) {
      // In a real app, you would send the message to your backend
      console.log(`Sending message to group ${activeGroup}: ${message}`);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <button 
          className="text-white hover:underline flex items-center"
          onClick={() => navigate('/chat')}
        >
          ← Back to Chat Gateway
        </button>
        <h2 className="text-xl font-semibold">Group Chat</h2>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search groups..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <ul className="divide-y divide-gray-200">
            {groups.map((group) => (
              <li
                key={group.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer flex items-center ${
                  activeGroup === group.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setActiveGroup(group.id)}
              >
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mr-3">
                  {group.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{group.name}</p>
                  <p className="text-sm text-gray-500 truncate">{group.lastMessage}</p>
                </div>
                {group.unread > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {group.unread}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeGroup ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mr-3">
                  {groups.find(g => g.id === activeGroup)?.name.split(' ').map(w => w[0]).join('')}
                </div>
                <h3 className="font-semibold">
                  {groups.find(g => g.id === activeGroup)?.name}
                </h3>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
                {groupMessages[activeGroup]?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 max-w-xs lg:max-w-md ${msg.sent ? 'ml-auto' : 'mr-auto'}`}
                  >
                    {!msg.sent && (
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        {msg.sender}
                      </p>
                    )}
                    <div
                      className={`p-3 rounded-2xl ${
                        msg.sent
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {msg.time}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-2 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <div className="text-5xl mb-4 text-gray-300">👥</div>
              <h3 className="text-xl font-medium mb-2">No group selected</h3>
              <p>Select a group to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupChatPage;