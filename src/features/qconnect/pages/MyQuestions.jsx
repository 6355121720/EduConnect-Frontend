import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { editQuestion, myQuestions } from "../../../api/qnaApi";

const MyQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const currentUser = useSelector(store => store.auth.user);

  useEffect(() => {
    const fetchMyQuestions = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        const res = await myQuestions();
        if (res.status === 200) {
          setQuestions(res.data);
        } else {
          setError("Failed to fetch questions");
        }
      } catch (err) {
        setError("An error occurred while fetching questions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyQuestions();
  }, [currentUser.username]);

  const handleEditClick = (question) => {
    setEditingId(question.id);
    setEditForm({
      title: question.title,
      description: question.description
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", description: "" });
  };

  const handleSaveEdit = async (questionId) => {
    if (!editForm.title || !editForm.description) {
      setError("Title and description cannot be empty");
      return;
    }
    if (editForm.title.length < 8) {
      setError("Title must be at least 8 characters");
      return;
    }
    if (editForm.description.length < 20) {
      setError("Description must be at least 20 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      // Replace with your actual API call
      const response = await editQuestion({
        id: questionId,
        title: editForm.title,
        description: editForm.description
      })

      if (response.status === 200) {
        setQuestions(prev =>
          prev.map(q => q.id === questionId ? {...q, title: editForm.title, description: editForm.description} : q)
        );
        setEditingId(null);
      } else {
        setError("Failed to update question");
      }
    } catch (err) {
      setError("An error occurred while updating the question");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold text-white mb-6">My Questions</h1>
      
      {loading && !questions.length && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {!loading && questions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          You haven't posted any questions yet.
        </div>
      )}

      <div className="space-y-6">
        {questions.map(question => (
          <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
            {editingId === question.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSaveEdit(question.id)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800">{question.title}</h2>
                <p className="text-gray-600 whitespace-pre-line">{question.description}</p>
                {question.tags && question.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {question.tags.map(tag => (
                      <span key={tag.id} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="pt-2">
                  <button
                    onClick={() => handleEditClick(question)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyQuestions;