// components/GroupList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGroup } from '../../../api/chatApi';

const GroupList = ({ searchTerm }) => {
  
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fun = async () => {
      if (searchTerm === ""){
        await getGroup();
      }
      await searchGroup
  }
  }, [searchTerm])

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredGroups.map(group => (
        <Link 
          to={`/groups/${group.id}`} 
          key={group.id}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg">{group.name}</h3>
            {group.isPrivate && (
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                Private
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {group.memberCount} members
          </p>
        </Link>
      ))}
    </div>
  );
};

export default GroupList;