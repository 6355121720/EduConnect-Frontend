// import { useState } from "react";
// import apiClient from '../../../api/apiClient'
// import { Universities, Courses, Skills } from '../../../constants/enums';
// import { Edit } from "lucide-react";
// import { update } from "../../../api/userApi";

// const EditProfileModal = ({ user, onClose }) => {

//   const [formData, setFormData] = useState({
//     fullName: user.fullName,
//     username: user.username,
//     email: user.email,
//     bio: user.bio,
//     linkedin: user.linkedin,
//     github: user.github,
//     university: user.university,
//     course: user.course,
//     skills: user.skills || [],
//     avatar: user.avatar,
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSkillChange = (selectedSkills) => {
//     setFormData(prev => ({ ...prev, skills: selectedSkills }));
//   };

//   const handleAvatarChange = (e) => {
//     setFormData(prev => ({...prev, avatar: e.target.files[0]}));
//   }



//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.fullName || !formData.username || !formData.email || !formData.university || !formData.course){
//       setErrorMessage("Invalid data.");
//     }

//     setIsSubmitting(true);

//     try{
//       const res = await apiClient('/auth/check-availability', {username: formData.username, email: formData.email});
//       if (res.status === 200){
//         if (!res.data.availability){
//           setErrorMessage("Username or Email is not available.");
//           console.log("username or email is not available.");
//           return;
//         }
//       }
//       else{
//         setErrorMessage("Server Error.");
//         console.log('Error in server while checking (username, email) uniqueness');
//         return;
//       }
//     } 
//     catch (e){
//       setErrorMessage("Server Error.");
//       console.log("Error while checking (username, email) uniqueness", e);
//       return;
//     }
//     finally{
//       setIsSubmitting(false);
//     }

//     setIsSubmitting(true);
    
//     try {
//       // In a real app, you would upload the avatar and update the user
//       const res = await update({...formData, avatar:null}, formData.avatar);

//       if (res.status === 200){
//         onClose();
//       }
//       else{
//         setErrorMessage("Error while updataing user.");
//       }

//     } catch (error) {
//       console.error('Error updating profile:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//         <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//           <div className="absolute inset-0 bg-gray-300 opacity-0"></div>
//         </div>
        
//         <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
//         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="sm:flex sm:items-start">
//               <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Edit Profile
//                 </h3>
                
//                 <form onSubmit={handleSubmit} className="mt-5 space-y-6">
//                   <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                     <div>
//                       <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
//                         Profile Picture
//                       </label>
//                       <div className="mt-1 flex items-center">
//                         <div className="relative">
//                           <img
//                             className="h-24 w-24 rounded-full object-cover"
//                             src={typeof(formData.avatar) == 'string' ? formData.avatar : URL.createObjectURL(formData.avatar) }
//                             alt="Profile preview"
//                           />
//                           <label
//                             htmlFor="avatar-upload"
//                             className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm cursor-pointer"
//                           >
//                             <Edit className="h-4 w-4 text-gray-600" />
//                             <input
//                               id="avatar-upload"
//                               name="avatar"
//                               type="file"
//                               className="sr-only"
//                               onChange={handleAvatarChange}
//                               accept="image/*"
//                             />
//                           </label>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
//                         Full Name
//                       </label>
//                       <input
//                         type="text"
//                         name="fullName"
//                         id="fullName"
//                         value={formData.fullName}
//                         onChange={handleChange}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       />
//                     </div>
                    
//                     <div>
//                       <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//                         Username
//                       </label>
//                       <input
//                         type="text"
//                         name="username"
//                         id="username"
//                         value={formData.username}
//                         onChange={handleChange}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       />
//                     </div>
                    
//                     <div>
//                       <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                         Email
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         id="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       />
//                     </div>
                    
//                     <div className="sm:col-span-2">
//                       <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
//                         Bio
//                       </label>
//                       <textarea
//                         name="bio"
//                         id="bio"
//                         rows="3"
//                         value={formData.bio}
//                         onChange={handleChange}
//                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       ></textarea>
//                     </div>
                    
//                     <div>
//                       <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
//                         LinkedIn URL
//                       </label>
//                       <div className="mt-1 flex rounded-md shadow-sm">
//                         <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
//                           linkedin.com/in/
//                         </span>
//                         <input
//                           type="text"
//                           name="linkedin"
//                           id="linkedin"
//                           value={formData.linkedin?.replace('https://linkedin.com/in/', '') || ''}
//                           onChange={(e) => handleChange({
//                             target: {
//                               name: 'linkedin',
//                               value: `https://linkedin.com/in/${e.target.value}`
//                             }
//                           })}
//                           className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         />
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label htmlFor="github" className="block text-sm font-medium text-gray-700">
//                         GitHub URL
//                       </label>
//                       <div className="mt-1 flex rounded-md shadow-sm">
//                         <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
//                           github.com/
//                         </span>
//                         <input
//                           type="text"
//                           name="github"
//                           id="github"
//                           value={formData.github?.replace('https://github.com/', '') || ''}
//                           onChange={(e) => handleChange({
//                             target: {
//                               name: 'github',
//                               value: `https://github.com/${e.target.value}`
//                             }
//                           })}
//                           className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         />
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label htmlFor="University" className="block text-sm font-medium text-gray-700">
//                         University
//                       </label>
//                       <select
//                         name="University"
//                         id="University"
//                         value={formData.university}
//                         onChange={handleChange}
//                         className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                       >
//                         {Object.values(Universities).map((uni) => (
//                           <option key={uni} value={uni}>
//                             {uni.replace(/_/g, ' ')}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label htmlFor="course" className="block text-sm font-medium text-gray-700">
//                         Course
//                       </label>
//                       <select
//                         name="course"
//                         id="course"
//                         value={formData.course}
//                         onChange={handleChange}
//                         className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                       >
//                         {Object.values(Courses).map((course) => (
//                           <option key={course} value={course}>
//                             {course.replace(/_/g, ' ')}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
                    
//                     <div className="sm:col-span-2">
//                       <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
//                         Skills
//                       </label>
//                       <select
//                         name="skills"
//                         id="skills"
//                         multiple
//                         value={formData.skills}
//                         onChange={(e) => handleSkillChange(Array.from(e.target.selectedOptions, option => option.value))}
//                         className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
//                       >
//                         {Object.values(Skills).map((skill) => (
//                           <option key={skill} value={skill}>
//                             {skill.replace(/_/g, ' ')}
//                           </option>
//                         ))}
//                       </select>
//                       <p className="mt-2 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple skills</p>
//                     </div>
//                   </div>

//                   <div className = "text-red-500 sm:text-sm text-[1rem]">
//                     {errorMessage}
//                   </div>
                  
//                   <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
//                     >
//                       {isSubmitting ? 'Saving...' : 'Save Changes'}
//                     </button>
//                     <button
//                       type="button"
//                       onClick={onClose}
//                       className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default EditProfileModal;





import { useState } from "react";
import { Universities, Courses, Skills } from '../../../constants/enums';
import { Edit } from "lucide-react";
import { checkUpdate, update } from "../../../api/userApi";
import { useDispatch } from "react-redux";
import { update as updateUserState } from "../../../store/slices/authSlice";

const EditProfileModal = ({ user, onClose, setUser, setSearchParams, searchParams }) => {

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id:user.id,
    role:user.role,
    password:user.password,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    bio: user.bio || '',
    linkedin: user.linkedin || '',
    github: user.github || '',
    university: user.university || '',
    course: user.course || '',
    skills: user.skills || [],
    avatar: user.avatar || null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleSkillChange = (e) => {
    const options = e.target.options;
    const selectedSkills = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedSkills.push(options[i].value);
      }
    }
    setFormData(prev => ({ ...prev, skills: selectedSkills }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, avatar: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.username || !formData.email || !formData.university || !formData.course) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await checkUpdate({
        username: formData.username, 
        email: formData.email
      });

      if (res.status === 200 && !res.data.availability) {
        setErrorMessage("Username or Email is not available.");
        return;
      }

      const updateRes = await update({
        ...formData,
        avatar: formData.avatar instanceof File ? null : formData.avatar
      }, formData.avatar instanceof File ? formData.avatar : null);

      if (updateRes.status === 200) {
        console.log(updateRes.data)
        dispatch(updateUserState(updateRes.data))
        setUser(updateRes.data)
        searchParams.set("username", updateRes.data.username);
        setSearchParams(searchParams);
        onClose();
      } else {
        setErrorMessage("Error while updating user.");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvatarUrl = () => {
    if (!formData.avatar) return '';
    if (typeof formData.avatar === 'string') return formData.avatar;
    return URL.createObjectURL(formData.avatar);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Fixed the overlay by removing the nested div structure */}
      <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" 
        onClick={() => onClose()}
        aria-hidden="true"
      ></div>
      
      <div className="relative flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Edit Profile
                </h3>
                
                <form onSubmit={handleSubmit} className="mt-5 space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="avatar" className="block text-sm font-medium text-gray-300">
                        Profile Picture
                      </label>
                      <div className="mt-1 flex items-center">
                        <div className="relative">
                          <img
                            className="h-24 w-24 rounded-full object-cover border-2 border-gray-600"
                            src={getAvatarUrl() || `https://ui-avatars.com/api/?name=${formData.fullName}&background=random&size=256`}
                            alt="Profile preview"
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 bg-gray-700 p-1 rounded-full shadow-sm cursor-pointer hover:bg-gray-600"
                          >
                            <Edit className="h-4 w-4 text-gray-300" />
                            <input
                              id="avatar-upload"
                              name="avatar"
                              type="file"
                              className="sr-only"
                              onChange={handleAvatarChange}
                              accept="image/*"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md shadow-sm py-2 px-3 bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                        Username *
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md shadow-sm py-2 px-3 bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md shadow-sm py-2 px-3 bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        id="bio"
                        rows="3"
                        value={formData.bio}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md shadow-sm py-2 px-3 bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300">
                        LinkedIn URL
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-300 sm:text-sm">
                          linkedin.com/in/
                        </span>
                        <input
                          type="text"
                          name="linkedin"
                          id="linkedin"
                          value={formData.linkedin?.replace('https://linkedin.com/in/', '') || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            linkedin: e.target.value ? `https://linkedin.com/in/${e.target.value}` : ''
                          }))}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="github" className="block text-sm font-medium text-gray-300">
                        GitHub URL
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-300 sm:text-sm">
                          github.com/
                        </span>
                        <input
                          type="text"
                          name="github"
                          id="github"
                          value={formData.github?.replace('https://github.com/', '') || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            github: e.target.value ? `https://github.com/${e.target.value}` : ''
                          }))}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="university" className="block text-sm font-medium text-gray-300">
                        University *
                      </label>
                      <select
                        name="university"
                        id="university"
                        value={formData.university}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="" className="bg-gray-700">Select University</option>
                        {Object.values(Universities).map((uni) => (
                          <option key={uni} value={uni} className="bg-gray-700">
                            {uni.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="course" className="block text-sm font-medium text-gray-300">
                        Course *
                      </label>
                      <select
                        name="course"
                        id="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      >
                        <option value="" className="bg-gray-700">Select Course</option>
                        {Object.values(Courses).map((course) => (
                          <option key={course} value={course} className="bg-gray-700">
                            {course.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-300">
                        Skills
                      </label>
                      <select
                        name="skills"
                        id="skills"
                        multiple
                        value={formData.skills}
                        onChange={handleSkillChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {Object.values(Skills).map((skill) => (
                          <option key={skill} value={skill} className="bg-gray-700">
                            {skill.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-sm text-gray-400">Hold Ctrl/Cmd to select multiple skills</p>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="text-red-400 sm:text-sm text-[1rem]">
                      {errorMessage}
                    </div>
                  )}
                    
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onClose(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;




