import { Link } from 'react-router-dom';
import { MessageCircle, Users } from 'lucide-react';

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
            <Link className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors" to="/chat/groups">
            <button>
              Enter Group Chat
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
  //     <header className="bg-gradient-to-r from-blue-700 to-indigo-800 py-12 text-center">
  //       <div className="container mx-auto px-4">
  //         <h1 className="text-4xl font-bold mb-3">EduConnect Chat</h1>
  //         <p className="text-xl text-blue-200 max-w-2xl mx-auto">
  //           Connect with your peers and educators in real-time
  //         </p>
  //       </div>
  //     </header>

  //     <div className="container mx-auto px-4 py-12">
  //       <div className="flex justify-center gap-10 mt-8 flex-wrap">
  //         <Link 
  //           to="/chat/personal"
  //           className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-2xl p-8 w-80 text-center shadow-xl hover:shadow-2xl transition-all"
  //         >
  //           <div className="flex justify-center mb-6">
  //             <MessageCircle className="w-16 h-16 text-blue-500" strokeWidth={1.5} />
  //           </div>
  //           <h2 className="text-2xl font-semibold mb-4">Personal Chat</h2>
  //           <p className="text-gray-400 mb-8 leading-relaxed">
  //             Private 1-on-1 conversations with classmates, teachers, or mentors
  //           </p>
  //           <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-500 hover:to-indigo-600 transition-all">
  //             Enter Personal Chat
  //           </button>
  //         </Link>

  //         <Link 
  //           to="/chat/groups"
  //           className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-2xl p-8 w-80 text-center shadow-xl hover:shadow-2xl transition-all"
  //         >
  //           <div className="flex justify-center mb-6">
  //             <Users className="w-16 h-16 text-indigo-500" strokeWidth={1.5} />
  //           </div>
  //           <h2 className="text-2xl font-semibold mb-4">Group Chat</h2>
  //           <p className="text-gray-400 mb-8 leading-relaxed">
  //             Collaborative spaces for classes, study groups, and projects
  //           </p>
  //           <button className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-500 hover:to-purple-600 transition-all">
  //             Enter Group Chat
  //           </button>
  //         </Link>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default MessagePage;