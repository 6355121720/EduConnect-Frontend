// GroupChatPage.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import GroupInfo from '../components/GroupInfo';
import InviteMembersModal from '../components/InviteMembersModal';
import { getGroup, getMessages, isValidGroup, joinGroup, joinRequest, leaveGroup } from '../../../api/chatApi';
import { useSelector } from 'react-redux';
import socketService from '../../../services/SocketService';
import { Lock, Users, Info, Loader } from 'lucide-react';

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
  const scrollRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0)
  }, [messages])

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
    return (
      <div className="h-screen flex justify-center items-center bg-gray-900">
        <Loader className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    )
  }

  if (!isMember){
    if (isPrivate){
      return (
        <div className="h-screen w-screen flex justify-center items-center bg-gray-900">
          <button onClick={sendJoinRequest} className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium text-xl flex items-center transition-transform hover:scale-105">
            <Lock className="w-6 h-6 mr-2" />
            Request To Join Group
          </button>
        </div>
      )
    }
    return (
      <div className="h-screen w-screen flex justify-center items-center bg-gray-900">
        <button onClick={joinPublicGroup} className="p-5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-xl flex items-center transition-transform hover:scale-105">
          <Users className="w-6 h-6 mr-2" />
          Join Public Group
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-white flex h-[88vh]">
      {/* Main chat area */}
      <div ref={scrollRef} />
      <div className="flex-1 flex flex-col max-w-4xl mx-auto h-full">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-900 w-10 h-10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold">{group.name}</h2>
          </div>
          <button 
            onClick={() => setShowGroupInfo(!showGroupInfo)}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
          >
            <Info className="w-6 h-6" />
          </button>
        </div>
        
        <MessageList messages = {messages} /> 
        
        <div className="p-5 border-t border-gray-800 bg-gray-800">
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