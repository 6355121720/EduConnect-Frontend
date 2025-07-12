// InviteMembersModal.jsx
const InviteMembersModal = ({ groupId, onClose }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call to send invitations
    onClose();
  };

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
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Select Friends</label>
            <div className="bg-gray-700 rounded p-3 h-40 overflow-y-auto">
              {/* Map through friends list */}
              <div className="flex items-center mb-2">
                <input type="checkbox" id="invite-user1" className="mr-2" />
                <label htmlFor="invite-user1" className="text-gray-300">Friend 1</label>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Invitation Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-gray-700 rounded px-3 py-2 text-white"
              rows="3"
              placeholder="Optional message..."
            />
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