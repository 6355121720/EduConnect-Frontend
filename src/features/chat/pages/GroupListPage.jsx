// GroupListPage.jsx
import { useState } from 'react';
import GroupList from '../components/GroupList';
import CreateGroupModal from '../components/CreateGroupModal';
import SearchBar from '../components/SearchBar';

const GroupListPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="dark:bg-gray-900 min-h-screen text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-left items-center mb-6">
          <h1 className="text-2xl font-bold">Your Groups</h1>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <SearchBar 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Search groups..."
          />
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Create Group
          </button>
        </div>
        
        <GroupList searchTerm={searchTerm} />
        
        {showCreateModal && (
          <CreateGroupModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    </div>
  );
};

export default GroupListPage;