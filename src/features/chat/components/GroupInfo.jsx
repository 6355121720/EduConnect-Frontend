

// const GroupInfo = ({ group, onInviteClick, onClose }) => {

import { useEffect, useState } from "react";
import { getIncomingRequests } from "../../../api/chatApi";

//   return (
//     <div className="h-full flex flex-col">
//       <div className="p-4 border-b border-gray-700 flex justify-between items-center">
//         <h3 className="font-bold">Group Info</h3>
//         <button onClick={onClose} className="text-gray-400 hover:text-white">
//           &times;
//         </button>
//       </div>
      
//       <div className="p-4 border-b border-gray-700">
//         <h4 className="text-lg font-medium mb-2">{group.name}</h4>
//         <div className="flex items-center gap-2 text-sm text-gray-400">
//           <span>{group.isPrivate ? 'Private' : 'Public'} group</span>
//           <span>•</span>
//           <span>{group.members.length + 1} members</span>
//         </div>
//       </div>
      
//       <div className="p-4 border-b border-gray-700">
//         <div className="flex justify-between items-center mb-3">
//           <h5 className="font-medium">Members</h5>
//           <button 
//             onClick={onInviteClick}
//             className="text-blue-400 hover:text-blue-300 text-sm"
//           >
//             Invite
//           </button>
//         </div>
        
//         <div className="space-y-3">
//           <div key={group.admin.id} className="flex items-center gap-3">
//               <img src={group.admin.avatar} className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center" />
//               <div>
//                 <p className="font-medium">{group.admin.fullName}</p>
//                 <p className="text-xs text-gray-400">Admin</p>
//               </div>
//             </div>
//           {group.members.map(member => (
//             <div key={member.id} className="flex items-center gap-3">
//               <img src={member.avatar} className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center" />
//               <div>
//                 <p className="font-medium">{member.fullName}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       <div className="p-4 mt-auto">
//         <button className="w-full py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm">
//           Leave Group
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GroupInfo;

import { respondToInvite } from "../../../api/chatApi";


const GroupInfo = ({ group, setGroup, currentUser, onInviteClick, onClose, onGroupLeave }) => {

  const [incomingRequests, setIncomingRequests] = useState([]);

  useEffect(() => {
    const fun = async () => {
      try{
        const res = await getIncomingRequests(group.name);
        if (res.status === 200){
          setIncomingRequests(res.data);
          console.log(res.data);
        }
        else{
          console.log("errow while fetching incomingRequests.");
        }
      }
      catch(e){
        console.log("errow while fetching incomingRequests.", e);
      }
    }
    fun();
  }, []);

  const handleInvite = async (data) => {
    console.log(data);
    try{
      const res = await respondToInvite(data);
      if (res.status === 200){
        if (data.accept){
          setGroup(prev => {return {...prev, members:[...prev.members, data.sender]}});
        }
        setIncomingRequests(prev => prev.filter(user => user !== data.sender));
      }
      else{
      console.log("error while responding to invite.");
      }
    }
    catch(e){
      console.log("error while responding to invite.", e);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-bold">Group Info</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          &times;
        </button>
      </div>
      
      <div className="p-4 border-b border-gray-700">
        <h4 className="text-lg font-medium mb-2">{group.name}</h4>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>{group.isPrivate ? 'Private' : 'Public'} group</span>
          <span>•</span>
          <span>{group.members.length + 1} members</span>
        </div>
      </div>
      
      {/* Incoming Requests Section - only visible if there are requests and user is admin */}
      {incomingRequests.length > 0 && group.admin.id === currentUser.id && (
        <div className="p-4 border-b border-gray-700">
          <h5 className="font-medium mb-3">Join Requests</h5>
          <div className="space-y-3">
            {incomingRequests.map(request => (
              <div key={request.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={request.avatar} className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center" />
                  <div>
                    <p className="font-medium">{request.fullName}</p>
                    <p className="text-xs text-gray-400">Requested to join</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleInvite({sender:request, groupName:group.name, accept:true})}
                    className="text-xs bg-green-600 hover:bg-green-500 px-2 py-1 rounded"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleInvite({sender:request, groupName:group.name, accept:false})}
                    className="text-xs bg-red-600 hover:bg-red-500 px-2 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h5 className="font-medium">Members</h5>
          {group.admin.id === currentUser.id && 
            <button 
              onClick={onInviteClick}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Invite
            </button>
          }
        </div>
        
        <div className="space-y-3">
          <div key={group.admin.id} className="flex items-center gap-3">
            <img src={group.admin.avatar} className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center" />
            <div>
              <p className="font-medium">{group.admin.fullName}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
          {group.members.map(member => (
            <div key={member.id} className="flex items-center gap-3">
              <img src={member.avatar} className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center" />
              <div>
                <p className="font-medium">{member.fullName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {group.admin.id !== currentUser.id && 
      <div className="p-4 mt-auto">
        <button 
          onClick={() => onGroupLeave()}
          className="w-full py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm cursor-pointer"
        >
          Leave Group
        </button>
      </div>
      }
    </div>
  );
};

export default GroupInfo;