import { useState } from 'react';
import { User, Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// 👈 أضفنا setRegisteredEmail للتمرير إلى صفحة التأكيد
const Register = ({ setCurrentPage, setRegisteredEmail }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const result = await register(formData);
    setIsSubmitting(false);

    if (result.success) {
      // 1. حفظ الإيميل لاستخدامه في واجهة إدخال الرمز
      if (setRegisteredEmail) {
        setRegisteredEmail(formData.email);
      }
      
      // 2. التوجيه لصفحة تأكيد الرمز
      setCurrentPage('verify-email');
    } else {
      // 3. تعديل القراءة إلى result.message بدلاً من result.error
      setErrorMsg(result.message || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700 p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Join us today by filling in the details below</p>
        </div>

        {/* عرض رسالة الخطأ عند وجودها */}
        {errorMsg && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

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
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50"
          >
            <UserPlus className="w-5 h-5" />
            <span>{isSubmitting ? 'Creating Account...' : 'Sign Up'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2 border-t dark:border-gray-700">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentPage('login')}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;