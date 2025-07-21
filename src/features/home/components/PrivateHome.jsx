import { useSelector } from "react-redux"
import FreindSuggestion from "./FreindSuggestion";


const PrivateHome = () => {

  let user = useSelector(store => store.auth.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Welcome Section */}
      <div className="bg-gradient-to-b from-yellow-900/10 via-transparent to-transparent py-32 px-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="slide-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-8 leading-tight">
              Welcome back,<br />
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
                {user?.fullName}
              </span>
            </h1>
            <p className="text-gray-300 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Ready to connect, learn, and grow with your student community?
            </p>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="card-glass p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="text-yellow-400 text-3xl mb-4">🎓</div>
                <h3 className="text-white font-bold text-lg mb-2">Find Students</h3>
                <p className="text-gray-400">Connect with peers</p>
              </div>
              <div className="card-glass p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="text-yellow-400 text-3xl mb-4">📅</div>
                <h3 className="text-white font-bold text-lg mb-2">Join Events</h3>
                <p className="text-gray-400">Discover opportunities</p>
              </div>
              <div className="card-glass p-6 text-center hover:scale-105 transition-all duration-300">
                <div className="text-yellow-400 text-3xl mb-4">💬</div>
                <h3 className="text-white font-bold text-lg mb-2">Start Chatting</h3>
                <p className="text-gray-400">Build relationships</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Friend Suggestions Section */}
      <div className="py-16">
        <FreindSuggestion />
      </div>
    </div>
  )
}

export default PrivateHome