

const GroupInfo = ({ group, onInviteClick, onClose }) => {

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
          <span>{group.members.length} members</span>
        </div>
      </div>
      
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h5 className="font-medium">Members</h5>
          <button 
            onClick={onInviteClick}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Invite
          </button>
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
      
      <div className="p-4 mt-auto">
        <button className="w-full py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm">
          Leave Group
        </button>
      </div>
    </div>
  );
};

export default GroupInfo;