import { useEffect, useState } from 'react';
import { acceptConnect, pendingRequest, rejectRequest } from '../../../api/connectAPI';

export default function ConnectionRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await pendingRequest();
        console.log(response.data);
        setRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleRequest = async (id, action) => {
    try {
      let res;
      if (action === "ACCEPT"){
        res = await acceptConnect({id});
      }
      else{
        res = await rejectRequest({id});
      }
      if (res.status === 200){
        setRequests(prev => prev.filter(req => req.sender.id !== id));
      }
      else{
        console.log("Conncetion request failed to respond.");
      }
    } catch (error) {
      console.error('Failed to process request:', error);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="font-medium text-white mb-3">Connection Requests ({requests.length})</h3>
      
      {requests.length === 0 ? (
        <p className="text-gray-400 text-sm">No pending requests</p>
      ) : (
        <ul className="space-y-3">
          {requests.map(request => (
            <li key={request.sender.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src={request.sender.avatar} 
                  alt={request.sender.fullName}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-white text-sm">{request.sender.fullName}</span>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleRequest(request.sender.id, 'ACCEPT')}
                  className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleRequest(request.sender.id, 'REJECT')}
                  className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}