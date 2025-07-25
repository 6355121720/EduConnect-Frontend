// GroupChatPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import GroupInfo from '../components/GroupInfo';
import InviteMembersModal from '../components/InviteMembersModal';
import { getGroup, getMessages, isValidGroup, joinGroup, joinRequest, leaveGroup } from '../../../api/chatApi';
import { useSelector } from 'react-redux';
import socketService from '../../../services/SocketService';

const GroupChatPage = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const [group, setGroup] = useState({
    name: "",
    members: [],
    admin: {id: "", fullName: ""},
    isPrivate: false
  });
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector(store => store.auth.user);
  const [isMember, setIsMember] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const navigate = useNavigate();

  const onGroupLeave = async () => {
    try{
      const res = await leaveGroup({groupName: group.name, username: currentUser.username})
      if (res.status === 200){
        setGroup(prev => {return {...prev, members: prev.members.filter(member => member.username !== currentUser.username)}});
        navigate("/chat/groups");
      }
      else{
        console.log("error while leaving group");
      }
    }
    catch(e){
      console.log("error while leaving group", e);
    }
  }

  const onMessageReceived = (res) => {
    const mes = JSON.parse(res.body);
    console.log(mes);
    if (mes.sender.id !== currentUser.id){
      setMessages(prev => [...prev, mes]);
    }

  }

  useEffect(() => {
    let subscription;
    const timeoutId = setTimeout(() => {
     subscription = socketService.subscribeGroupMessage(name, onMessageReceived);
    }, 1000)

    return (() => {
      clearTimeout(timeoutId);
      if (subscription){
        subscription.unsubscribe();
      }
    })
  }, [name])

  const joinPublicGroup = async () => {
    try{
      const res = await joinGroup({username: currentUser.username, groupName: name});
      if (res.status === 200){
        setGroup(prev => {return {...prev, members: [...prev.members, currentUser]}});
        setIsMember(true);
      }
      else{
        console.log("error while joining group.");
      }
    }
    catch(e){
      console.log('error while joining group.', e);
    }
  }

  useEffect(() => {
    setIsMember(false);
    const fetchGroupData = async () => {
      setLoading(true);
      try {
        const res = await isValidGroup(name);
        if (res.status !== 200 || !res.data) {
          navigate("/unauthorized");
          return;
        }

        const groupRes = await getGroup(name);
        if (groupRes.status === 200) {
          console.log("group", groupRes.data)
          if (groupRes.data.admin.id === currentUser.id || groupRes.data.members.map(member => member.id === currentUser.id).reduce((acc, cur) => acc + cur, 0)) setIsMember(true);
          console.log("this is ", groupRes.data.private);
          setIsPrivate(groupRes.data.isPrivate);
          setGroup(groupRes.data);
        } else {
          console.log("error while getting group.");
        }

        const messageRes = await getMessages(name);
        if (messageRes.status === 200) {
          console.log("messages", messageRes.data);
          setMessages(messageRes.data);
        } else {
          console.log("error while fetching messages.");
        }
      } catch (e) {
        console.log("Unexpected error:", e);
        navigate("/unauthorized");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [name]);

  const sendJoinRequest = async () => {
    try{
      const res = await joinRequest({groupName: group.name, username: currentUser.username});
      if (res !== 200){
        console.log("error while sending join request.");
      }
      navigate("/chat/groups")
    }
    catch(e){
      console.log("error while sending join request.", e);
    }
  }


  if (loading){
    return <div className="h-screen flex justify-center items-center text-3xl">Loading...</div>
  }

  if (!isMember){
    if (isPrivate){
      return <button onClick={sendJoinRequest} className="text-3xl h-screen w-screen flex justify-center items-center"><div className = "p-3 rounded-full bg-amber-400 text-black cursor-pointer">Request To Join Group</div></button>    
    }
    return <button onClick={joinPublicGroup} className="text-3xl h-screen w-screen flex justify-center items-center"><div className = "p-3 rounded-full bg-amber-400 text-black cursor-pointer">Join Public Group</div></button>    
  }

  return (
    <div className="dark:bg-gray-900 text-white flex">
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
            currentUser={currentUser}
            setGroup={setGroup}
            group = {group}
            onInviteClick={() => setShowInviteModal(true)}
            onClose={() => setShowGroupInfo(false)}
            onGroupLeave = {onGroupLeave}
          />
        </div>
      )}
      
      {showInviteModal && (
        <InviteMembersModal 
          group={group}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
};

export default GroupChatPage;