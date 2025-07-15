import { useState } from "react";
import { useSelector } from "react-redux";
import { bulkGroupInvites } from "../../../api/chatApi";

// InviteMembersModal.jsx
const InviteMembersModal = ({ group, onClose }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const connections = useSelector(store => store.connection.connections);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const res = await bulkGroupInvites({groupName: group.name, usernames: selectedUsers});
      if (res.status !== 200){
        console.log("error while inviting.");
      }
      else{
        setSelectedUsers([]);
      }
    }catch (e){
      console.log("error while inviting.", e);
    }
    onClose();
  };

  const handleToggle = (connection) => {
    if (selectedUsers.includes(connection)){
      setSelectedUsers(selectedUsers.filter(user => user !== connection));
    }
    else{
      setSelectedUsers([...selectedUsers, connection]);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Invite Members</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
                {connections.map(connection => (
                  <label key={connection.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(connection.username)}
                      onChange={() => handleToggle(connection.username)}
                    />
                    {connection.fullName}
                  </label>
                ))}
              </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
            >
              Send Invites
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMembersModal;