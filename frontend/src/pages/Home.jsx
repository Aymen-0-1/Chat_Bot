import { User, Mail, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  // 👈 اضغط F12 وافحص تبويب Console لتري شكل البيانات القادمة
  console.log("Current User in Home:", user);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Welcome back, {user?.name || 'User'}! 👋
      </h2>

      {/* User Info Card Preview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm max-w-xl">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Current Account Information
        </h3>
        
        <div className="space-y-4">
          {/* Full Name */}
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <User className="w-5 h-5 text-blue-500" />
            <span>
              Name: <strong className="text-gray-900 dark:text-white">{user?.name || 'N/A'}</strong>
            </span>
          </div>

          {/* Email Address */}
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <Mail className="w-5 h-5 text-blue-500" />
            <span>
              Email: <strong className="text-gray-900 dark:text-white">{user?.email || 'N/A'}</strong>
            </span>
          </div>

          {/* Status Email */}
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <span>
              Account Status: <strong>{user?.is_verified ? 'Confirmed and activated' : 'Active'}</strong>
            </span>
          </div>

          {/* Registration Date (If available from backend) */}
          {user?.created_at && (
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm pt-2 border-t dark:border-gray-700">
              <Clock className="w-4 h-4" />
              <span>
                Member since: <strong>{new Date(user.created_at).toLocaleDateString()}</strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;