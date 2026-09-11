import { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth} from '../context/AuthContext';

const Login = ({ setCurrentPage }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const result = await login(formData);
    setIsSubmitting(false);

    if (result.success) {
      setCurrentPage('home'); 
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please enter your details to sign in</p>
        </div>

{/* 👈 أضف هذا الجزء هنا بالضبط قبل الـ form */}
{errorMsg && (
  <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg text-center font-medium">
    {errorMsg}
  </div>
)}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            <LogIn className="w-5 h-5" />
              <span>{isSubmitting ? 'Signing In...' : 'Log In'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2 border-t dark:border-gray-700">
          Don't have an account?{' '}
          <button
            onClick={() => setCurrentPage('register')}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1"
          >
            Sign Up <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage('forgot-password')}
            className="ml-4 text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;