import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Welcome Back
          </h2>
          <p className="text-gray-400 mt-1">
            Sign in to your EduConnect account
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <a 
              href="/signup" 
              className="text-purple-500 hover:text-purple-400 font-medium"
            >
              Sign up
            </a>
          </p>
          <a 
            href="/forgot-password" 
            className="inline-block mt-2 text-purple-500 hover:text-purple-400 text-sm"
          >
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;