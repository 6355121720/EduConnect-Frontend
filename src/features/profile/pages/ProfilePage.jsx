import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Mail, 
  Link, 
  Github, 
  Linkedin, 
  Edit, 
  Calendar,
  User,
  BookOpen,
  GraduationCap,
  Shield
} from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';
import { getProfile } from '../../../api/userApi';
import { useSelector } from 'react-redux';

const ProfilePage = () => {

  const currentUser = useSelector(store => store.auth.user);
  const [serachParams, setSearchParams] = useSearchParams();
  const username = serachParams.get("username");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  

  useEffect(() => {
    const fetchUser = async () => {
      // useSelector(store => store.auth.user);
      try {
        console.log(username)
        const response = await getProfile(username);
        if (response.status === 200){
          setUser(response.data.user);
          console.log(response.data.user.username, currentUser.username);
          setIsCurrentUser(response.data.user.username === currentUser.username);
        }
        else{
          console.log(response)
          console.log("Error while fetching user", username);
        }
      } catch (error) {
        console.error('Failed to load user profile', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username, currentUser]);



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">User not found</h2>
          <p className="text-gray-600">The requested profile doesn't exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow"
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}&background=random&size=256`}
                  alt={user.fullName}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
                  {user.role === 'ADMIN' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Admin
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mt-1">@{user.username}</p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {user.university && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <GraduationCap className="h-3 w-3" />
                      {user.university.replace(/_/g, ' ')}
                    </span>
                  )}
                  
                  {user.course && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      <BookOpen className="h-3 w-3" />
                      {user.course.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
                
                {isCurrentUser && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-6 py-4 sm:px-8">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1.5" />
              <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        {/* Profile Details */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* About Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">About</h3>
            </div>
            <div className="px-6 py-5">
              {user.bio ? (
                <p className="text-gray-700 whitespace-pre-line">{user.bio}</p>
              ) : (
                <p className="text-gray-500 italic">No bio yet</p>
              )}
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Contact</h3>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              
              {user.linkedin && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Linkedin className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">LinkedIn</p>
                    <a 
                      href={user.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      {user.linkedin.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
              
              {user.github && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Github className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">GitHub</p>
                    <a 
                      href={user.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      {user.github.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden lg:col-span-2">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Skills</h3>
            </div>
            <div className="px-6 py-5">
              {user.skills && user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {skill.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal 
          user={user} 
          onClose={() => setIsEditModalOpen(false)} 
          setUser = {setUser}
          setSearchParams = {setSearchParams}
          searchParams = {serachParams}
        />
      )}
    </div>
  );
};

export default ProfilePage;




