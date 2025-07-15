// components/GroupList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { myGroups } from '../../../api/chatApi';
import {searchGroup} from '../../../api/chatApi'

const GroupList = ({ searchTerm, groups, setGroups }) => {
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fun = async () => {
      setLoading(true);
      if (searchTerm === ""){
        try{
          const res = await myGroups();
          if (res.status === 200){
            console.log(res.data);
            setGroups(res.data);
          }
          else{
            console.log("error while fetching groups.");
          }
        }
        catch(e){
          console.log("error while fetching groups.", e);
        }
        finally{
          setLoading(false);
        }
      }
      else{
        try{
          const res = await searchGroup(searchTerm);
          if (res.status === 200){
            setGroups(res.data);
          }
          else{
            console.log("error while searching groups.");
          }
        }
        catch(e){
          console.log("error while searching groups.", e);
        }
        finally{
          setLoading(false);
        }
      }
    }

    const timeout = setTimeout(() => {
      fun();
    }, 1500)

    return (() => {
      clearTimeout(timeout);
    })

  }, [searchTerm])

  if (loading) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map(group => (
        <Link 
          to={`/chat/group?name=${group.name}`}
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
            {group.members?.length + 1} members
          </p>
        </Link>
      ))}
    </div>
  );
};

export default GroupList;