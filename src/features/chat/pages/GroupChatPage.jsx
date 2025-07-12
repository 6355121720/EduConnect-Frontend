// GroupChatPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import GroupInfo from '../components/GroupInfo';
import InviteMembersModal from '../components/InviteMembersModal';
import { getGroup, getMessages } from '../../../api/chatApi';
import { useSelector } from 'react-redux';

const GroupChatPage = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const [group, setGroup] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector(store => store.auth.user);

  useEffect(() => {

    const fun = async () => {
      setLoading(true);
      try{
        const res = await getGroup(name);
        if (res.status === 200){
          setGroup(res.data);
        }
        else{
          console.log("error while getting group.");
        }
      }
      catch(e){
        console.log("error while getting group.", e);
      }
      try{
        const res = await getMessages(name);
        if (res.status === 200){
          setMessages(res.data);
        }
        else{
          console.log("error while fetching messages.");
        }
      }
      catch(e){
        console.log("error while fetching messages.", e);
      }
      setLoading(false);
    }
    fun();

  }, [name])

  if (loading){
    return <>Loading...</>
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen text-white flex">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Group Name</h2>
          <button 
            onClick={() => setShowGroupInfo(!showGroupInfo)}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        
        <MessageList messages = {messages} />
        
        <div className="p-4 border-t border-gray-700">
          <MessageInput group={group} currentUser = {currentUser} setMessages = {setMessages} />
        </div>
      </div>
      
      {/* Group info sidebar */}
      {showGroupInfo && (
        <div className="w-80 bg-gray-800 border-l border-gray-700">
          <GroupInfo 
            group = {group}
            onInviteClick={() => setShowInviteModal(true)}
            onClose={() => setShowGroupInfo(false)}
          />
        </div>
      )}
      
      {/* Invite members modal */}
      {showInviteModal && (
        <InviteMembersModal 
          groupId={groupId}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
};

export default GroupChatPage;