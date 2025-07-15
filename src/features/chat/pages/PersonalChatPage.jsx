import { File, Loader, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatUsers, searchByUsername } from '../../../api/userApi';
import { useSelector } from 'react-redux';
import { getChat, getFileUrl, sendPrivateMessage } from '../../../api/chatApi';
import socketService from '../../../services/SocketService';

const PersonalChatPage = () => {

  const currentUser = useSelector(store => store.auth.user);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [activeChat, setActiveChat] = useState(null);
  const activeRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatRef = useRef(null);
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    activeRef.current = activeChat;
  }, [activeChat])

  const handleSendMessage = async () => {
    if ((!message.trim() && !file) || isSending || !activeChat) return;
    
    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('receiverUname', activeChat);
      formData.append("senderUname", currentUser.username);
      formData.append("timestamp", new Date().toISOString());
      
      if (file) {
        const fileUrl = await getFileUrl(file);
        if (fileUrl.status !== 200) return;
        formData.append('fileUrl', fileUrl.data);
        formData.append("fileName", message)
        formData.append("content", "");
        formData.append("mediaType", "FILE");
      } else {
        formData.append("mediaType", "TEXT");
        formData.append('fileUrl', "");
        formData.append("fileName", "")
        formData.append('content', message);
      }

      const res = await sendPrivateMessage(Object.fromEntries(formData.entries()));
      if (res.status === 200) {
        setMessages(prev => [...prev, res.data]);
        socketService.sendPrivateMessage(Object.fromEntries(formData.entries()));
        setMessage("");
        setFile(null);
      } else {
        console.log("Error sending message", res.statusText);
      }
    } catch (e) {
      console.log("Error sending message", e);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(selectedFile.name); // Show file name in input
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const onMessageReceived = (res) => {
    let tmp = JSON.parse(res.body);
    console.log(tmp, tmp.sender.username, activeRef.current);
    tmp.type = tmp.mediaType;
    if (tmp.sender.username === activeRef.current) {
      setMessages(prev => [...prev, tmp]);
    }
  };

  useEffect(() => {
    let subscription;

    const timeoutId = setTimeout(() => {
      subscription = socketService.subscribePrivate(onMessageReceived);
    }, 1000);

    return () => {
      clearTimeout(timeoutId); // cleanup the timeout in case component unmounts before 500ms
      if (subscription) {
        subscription.unsubscribe(); // safely unsubscribe if it exists
      }
    };
  }, []);


  useEffect(() => {
    if (!activeChat) return;
    const fun = async () => {
      try {
        const res = await getChat(activeChat);
        if (res.status === 200) {
          setMessages(res.data);
        } else {
          console.log("error while fetching messages.", res.statusText);
        }
      } catch (e) {
        console.log("error while fetching messages.", e);
      }
    };
    fun();
  }, [activeChat]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const getChatUsers = async () => {
    setSearchLoading(true);
    try {
      const res = await chatUsers();
      if (res.status === 200) {
        setUsers(res.data);
      } else {
        console.log("Error while fetching chat users.");
      }
    } catch (e) {
      console.log("Error while fetching chat users.", e);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    getChatUsers();
  }, []);

  const onSearch = async () => {
    setSearchLoading(true);
    try {
      const res = await searchByUsername(search.trim());
      if (res.status === 200) {
        setUsers(res.data);
      } else {
        console.log("search by username has some issues", res.statusText);
      }
    } catch (e) {
      console.log("Search by username has some issues.", e);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="flex h-[70vh] flex-col bg-gray-50">
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
        <button 
          className="text-white hover:underline flex items-center"
          onClick={() => navigate('/chat')}
        >
          ← Back to Chat Gateway
        </button>
        <h2 className="text-xl font-semibold">Personal Chat</h2>
        <div className="w-8"></div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-white text-blue-700 border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex md:gap-4 items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchLoading ? <Loader /> : <Search onClick={onSearch} />}
          </div>

          <ul className="divide-y divide-gray-200">
            {users.map((contact) => (
              <li
                key={contact.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer flex items-center ${
                  activeChat === contact.username ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  setActiveChat(contact.username)
                }}
              >
                <img src={contact.avatar} className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mr-3" />
                  {/* {contact.fullName.charAt(0)} */}
                {/* </div> */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{contact.fullName}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeChat ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center">
                <img src={users.find(c => c.username === activeChat)?.avatar} className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mr-3" />
                  {/* {users.find(c => c.username === activeChat)?.fullName.charAt(0)}
                </div> */}
                <h3 className="font-semibold text-blue-600">
                  {users.find(c => c.username === activeChat)?.fullName}
                </h3>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-gray-100 text-blue-600" ref={chatRef}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 max-w-xs lg:max-w-md ${msg.sender.username === currentUser.username ? 'ml-auto' : 'mr-auto'}`}
                  >
                    <div
                      className={`p-3 rounded-2xl ${
                        msg.sender.username === currentUser.username
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white rounded-bl-none'
                      }`}
                    >
                      {msg.type === 'TEXT' ? (
                        <span>{msg.content}</span>
                      ) : (
                        <>
                          <File className="inline mr-2" />
                          <a
                            href={msg.fileUrl}
                            download={msg.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={` underline break-words`}
                          >
                            {msg.fileName}
                          </a>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="*"
                />
                <button
                  onClick={triggerFileInput}
                  className="mr-2 bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-300"
                >
                  <File className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={file ? file.name : "Type a message..."}
                  className="text-blue-600 flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || (!message.trim() && !file)}
                  className="ml-2 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isSending ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
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
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <div className="text-5xl mb-4 text-gray-300">💬</div>
              <h3 className="text-xl font-medium mb-2">No chat selected</h3>
              <p>Select a contact to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalChatPage;