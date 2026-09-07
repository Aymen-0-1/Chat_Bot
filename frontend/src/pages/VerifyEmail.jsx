import { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

const VerifyEmail = ({ email, onVerificationSuccess }) => {
    const [code, setCode] = useState('');
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [resend, setResend] = useState(false);

    const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const response = await authService.verifyEmail(email, code);
      setStatusMsg({ type: 'success', text: response.message });
      
      setTimeout(() => {
        if (onVerificationSuccess) onVerificationSuccess();
      }, 2000);
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Invalid or expired verification code',
      });
    } finally {
      setLoading(false);
    }
    };

    const handleResendCode = async () => {
      setResend(true);
      setStatusMsg({ type: '', text: '' });
      try {
        const response = await authService.resendVerificationCode(email);
        setStatusMsg({ type: 'success', text: response.message});
      } catch(err) {
        setStatusMsg({type: 'error', text: err.response?.data?.message || 'Failed to resend verification code'});
      }finally {
        setResend(false);
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 border dark:border-gray-700">
        
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Verify Your Email
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We sent a 6-digit verification code to <br />
            <span className="font-semibold text-blue-600 dark:text-blue-400">{email || 'your email'}</span>
          </p>
        </div>

        {/* Status Message */}
        {statusMsg.text && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              statusMsg.type === 'success'
                ? 'bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block text-center">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              maxLength="6"
              required
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.trim())}
              className="w-full text-center text-3xl tracking-widest font-mono py-3 border rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 shadow-md"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
          <button
            onClick={handleResendCode}
            type="button"
            disabled={resend}
            className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 shadow-md"
          >
            {resend ? 'Resending...' : 'Resend Code'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default VerifyEmail;