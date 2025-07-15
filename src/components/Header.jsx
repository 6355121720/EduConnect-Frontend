import { Link, useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiUsers, FiCalendar, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../api/authApi';
import { useState } from 'react';
import { logoutService } from '../services/authService';
import { QuestionCircleOutlined, QuestionCircleTwoTone } from '@ant-design/icons';
import { FcAnswers } from 'react-icons/fc';
import { SiAnswer } from 'react-icons/si';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { FaQuestionCircle } from 'react-icons/fa';

export default function Header() {
  const { user: currentUser, isAuthenticated } = useSelector(store => store.auth);
  const [openMenu, setOpenMenu] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutService());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-purple-500 font-bold text-xl">
          EduConnect
        </Link>

        {/* Navigation Links - Only shown when authenticated */}
        {isAuthenticated && (
          <nav className="hidden md:flex space-x-6">
            <Link to="/students" className="text-gray-300 hover:text-white flex items-center gap-1">
              <FiUsers /> <span>Students</span>
            </Link>
            <Link to="/events" className="text-gray-300 hover:text-white flex items-center gap-1">
              <FiCalendar /> <span>Events</span>
            </Link>
            <Link to="/chat" className="text-gray-300 hover:text-white flex items-center gap-1">
              <FiMessageSquare /> <span>Messages</span>
            </Link>
            <Link to="/qconnect" className="text-gray-300 hover:text-white flex items-center gap-1">
              <QuestionCircleOutlined  /> <span>QConnect</span>
            </Link>
          </nav>
        )}

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none" onClick = {() => setOpenMenu(cur => !cur)}>
                <img 
                  src={currentUser?.avatar || '/default-avatar.png'} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border border-gray-700"
                />
                <span className="text-gray-300 hidden md:inline">
                  {currentUser?.fullName || currentUser?.username}
                </span>
              </button>

              {/* Dropdown Menu */}
              {openMenu && 
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <Link to={`/profile?username=` + currentUser.username} className="px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                    <FiUser /> Profile
                  </Link>
                  <Link to="/settings" className="px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                    <FiSettings /> Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              }
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-transparent hover:bg-gray-800 text-white px-4 py-2 rounded-md transition border border-gray-700"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}