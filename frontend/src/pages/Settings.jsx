import { useState } from 'react';
import { User, Mail, Save, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Settings = () => {
  const { user, setUser, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // دالة حفظ التعديلات
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const response = await authService.updateUser({ name, email });
      const updatedData = response.user || response;
      setUser(updatedData);
      
      setStatusMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // دالة حذف الحساب
// دالة حذف الحساب المعدلة
const handleDeleteAccount = async () => {
  try {
    setIsUpdating(true);
    // 1. إرسال طلب الحذف للباكأند
    await authService.deleteUser();
    
    // 2. إظهار رسالة النجاح (اختياري قبل التوجيه)
    setStatusMsg({ type: 'success', text: 'Account deleted successfully!' });

    // 3. مسح الحالة والوجلسة مباشرة
    localStorage.removeItem('user');
    setUser(null);

  } catch (err) {
    // لن يدخل هنا إلا إذا فشل الباكأند فعلياً في الحذف
    console.error("Delete Error:", err);
    setStatusMsg({
      type: 'error',
      text: err.response?.data?.message || 'Failed to delete account',
    });
    setShowDeleteConfirm(false);
  } finally {
    setIsUpdating(false);
  }
};

  return (
    <div className="space-y-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Account Settings</h2>

      {statusMsg.text && (
        <div
          className={`p-4 rounded-lg font-medium text-sm ${
            statusMsg.type === 'success'
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Form */}
      <form 
        key={user?.id || 'loading'} 
        onSubmit={handleUpdate} 
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-3">
          Edit your information:
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full name</label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </form>

      {/* Delete Section */}
      <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-900/40 space-y-4">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Danger Zone</h3>
        </div>
        <p className="text-sm text-red-600/80 dark:text-red-400/80">
          When you delete your account, all your data will be permanently erased.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete account permanently</span>
          </button>
        ) : (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-red-300 dark:border-red-800 space-y-3">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              Are you sure you want to delete your account?
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium text-sm rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;