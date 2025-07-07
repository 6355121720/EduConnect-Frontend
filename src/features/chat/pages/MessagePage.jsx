import { Link } from 'react-router-dom';

const MessagePage = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-5 text-center rounded-b-xl shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold m-0">EduConnect Chat</h1>
          <p className="mt-2">Connect with your peers and educators</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center gap-8 mt-12 flex-wrap">
          <div 
            className="bg-white rounded-xl p-8 w-72 text-center shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            <div className="text-5xl mb-5 text-blue-600">💬</div>
            <h2 className="text-xl font-semibold text-blue-600 mb-3">Personal Chat</h2>
            <p className="text-gray-600 mb-6">
              Connect one-on-one with classmates, teachers, or mentors for private conversations.
            </p>
            <Link className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors" to="/chat/personal">
            <button>
              Enter Personal Chat
            </button>
            </Link>
          </div>

          <div 
            className="bg-white rounded-xl p-8 w-72 text-center shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            <div className="text-5xl mb-5 text-blue-600">👥</div>
            <h2 className="text-xl font-semibold text-blue-600 mb-3">Group Chat</h2>
            <p className="text-gray-600 mb-6">
              Join class discussions, study groups, or project teams in collaborative spaces.
            </p>
            <Link className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors" to="/chat/group">
            <button>
              Enter Group Chat
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePage;