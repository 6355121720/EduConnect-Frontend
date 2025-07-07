// // File: src/features/auth/pages/SignupPage.jsx
// import React, { useState } from 'react';
// import SignupStepOne from '../components/SignupStepOne';
// import SignupStepTwo from '../components/SignupStepTwo';
// import SignupStepThreeOtp from '../components/SignupStepThree';

// const SignupPage = () => {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     username: '',
//     email: '',
//     avatar: '',
//     university: '',
//     skills: [],
//     course: '',
//     password: '',
//     role: 'USER'
//   });

//   const nextStep = () => setStep(prev => prev + 1);
//   const prevStep = () => setStep(prev => prev - 1);
//   const updateFormData = newData => {
//     setFormData(prev => ({ ...prev, ...newData }));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
//         <div className="mb-6 text-center">
//           <h2 className="text-2xl font-semibold text-gray-800">Sign Up</h2>
//           <p className="text-gray-500">Step {step} of 3</p>
//         </div>

//         {step === 1 && (
//           <SignupStepOne
//             nextStep={nextStep}
//             updateFormData={updateFormData}
//             formData={formData}
//           />
//         )}

//         {step === 2 && (
//           <SignupStepTwo
//             nextStep={nextStep}
//             prevStep={prevStep}
//             updateFormData={updateFormData}
//             formData={formData}
//           />
//         )}

//         {step === 3 && (
//           <SignupStepThreeOtp
//             prevStep={prevStep}
//             formData={formData}
//             updateFormData={updateFormData}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default SignupPage;


import React, { useState } from 'react';
import SignupStepOne from '../components/SignupStepOne';
import SignupStepTwo from '../components/SignupStepTwo';
import SignupStepThreeOtp from '../components/SignupStepThree';
import { FiArrowLeft } from 'react-icons/fi';

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    avatar: '',
    university: '',
    skills: [],
    course: '',
    password: '',
    role: 'USER'
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const updateFormData = newData => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-xl bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700 relative">
        {/* Back button (shown except on first step) */}
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-1"
          >
            <FiArrowLeft className="inline" /> Back
          </button>
        )}

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white">Join EduConnect</h2>
          <div className="flex justify-center mt-4 mb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${step >= i ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                  {i}
                </div>
                {i < 3 && (
                  <div className={`w-12 h-1 mx-1 ${step > i ? 'bg-purple-600' : 'bg-gray-700'}`}></div>
                )}
              </div>
            ))}
          </div>
          <p className="text-gray-400">Step {step} of 3</p>
        </div>

        {/* Form Steps */}
        <div className="px-4">
          {step === 1 && (
            <SignupStepOne
              nextStep={nextStep}
              updateFormData={updateFormData}
              formData={formData}
            />
          )}

          {step === 2 && (
            <SignupStepTwo
              nextStep={nextStep}
              prevStep={prevStep}
              updateFormData={updateFormData}
              formData={formData}
            />
          )}

          {step === 3 && (
            <SignupStepThreeOtp
              prevStep={prevStep}
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="text-purple-500 hover:text-purple-400 font-medium">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;