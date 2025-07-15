import { useState } from "react";
import { useSelector } from "react-redux";
import { createGroup } from "../../../api/chatApi";

// CreateGroupModal.jsx
const CreateGroupModal = ({ onClose, setGroups }) => {
  const [form, setForm] = useState({
    name: "",
    isPrivate: false,
    notifies: []
  })
  const connections = useSelector(store => store.connection.connections);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]:e.target.value});
  }

  const handleNotifiesToggle = (notify) => {
    const newNotifies = form.notifies.includes(notify) ?
      form.notifies.filter(item => item !== notify) :
      [...form.notifies, notify];
      setForm({...form, notifies:newNotifies});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form)
    if (form.name === ""){
      setErrorMessage("empty name");
      return;
    }

    setLoading(true);

    try{
      const res = await createGroup(form);
      if (res.status === 200){
        console.log(res.data);
        setGroups(prev => [...prev, res.data])
        onClose();
      }
      else{
        console.log("error while creating group.", res);
        setErrorMessage(res.statusText);
      }
    }
    catch(e){
      console.log("error while creating group.", e);
      setErrorMessage("Something wrong happened.");
    }
    finally{
      setLoading(false);
    }

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Group</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Group Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) => handleChange(e)}
              className="w-full bg-gray-700 rounded px-3 py-2 text-white"
              required
            />
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="private"
              name="isPrivate"
              checked={form.isPrivate}
              onChange={(e) => {
                setForm(prev => {return {...prev, isPrivate: e.target.checked}});
              }}
              className="mr-2"
            />
            <label htmlFor="private" className="text-gray-300">
              Private Group
            </label>
          </div>
          
          <div className="mb-4">
            <div className="space-y-2">
              <p className="font-semibold">Invite Connections</p>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
                {connections.map(connection => (
                  <label key={connection.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.notifies.includes(connection)}
                      onChange={() => handleNotifiesToggle(connection)}
                    />
                    {connection.fullName}
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
            >
              {loading ? "Loading..." : "Create"}
            </button>
          </div>

          {errorMessage && <div className = "">{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;