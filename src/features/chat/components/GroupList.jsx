// components/GroupList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { myGroups } from '../../../api/chatApi';
import {searchGroup} from '../../../api/chatApi'
import { Users, Lock, Loader } from 'lucide-react';

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

  // if (loading) return <div>Loading...</div>

  // return (
  //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //     {groups.map(group => (
  //       <Link 
  //         to={`/chat/group?name=${group.name}`}
  //         key={group.id}
  //         className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors"
  //       >
  //         <div className="flex justify-between items-start">
  //           <h3 className="font-medium text-lg">{group.name}</h3>
  //           {group.isPrivate && (
  //             <span className="text-xs bg-gray-700 px-2 py-1 rounded">
  //               Private
  //             </span>
  //           )}
  //         </div>
  //         <p className="text-gray-400 text-sm mt-2">
  //           {group.members?.length + 1} members
  //         </p>
  //       </Link>
  //     ))}
  //   </div>
  // );
  if (loading) return (
    <div className="flex justify-center py-10">
      <Loader className="animate-spin h-8 w-8 text-blue-500" />
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {groups.map((group, index) => (
        <Link 
          to={`/chat/group?name=${group.name}`}
          key={group.id || group.name || index}
          className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-xl p-5 transition-all hover:shadow-lg group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-900 w-12 h-12 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-lg group-hover:text-blue-400 transition-colors">{group.name}</h3>
            </div>
            {group.isPrivate && (
              <span className="text-xs bg-gray-700 px-2.5 py-1 rounded-full flex items-center">
                <Lock className="w-3 h-3 mr-1" /> Private
              </span>
            )}
          </div>
          <div className="flex items-center text-gray-400 text-sm mt-4">
            <span className="bg-gray-700 px-2.5 py-1 rounded-full">
              {group.members?.length + 1} members
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GroupList;