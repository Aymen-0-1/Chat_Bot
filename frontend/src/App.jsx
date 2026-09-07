import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail'; // 👈 استيراد مكون تأكيد الإيميل

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 👈 الحالة لتحديد الصفحة الحالية
  const [registeredEmail, setRegisteredEmail] = useState(''); // 👈 حالة لحفظ الإيميل بعد التسجيل

  return (
    <ThemeProvider>
      <AuthProvider>
        {currentPage === 'login' && (
          <Login setCurrentPage={setCurrentPage} />
        )}

        {currentPage === 'register' && (
          <Register 
            setCurrentPage={setCurrentPage} 
            setRegisteredEmail={setRegisteredEmail} // 👈 تمرير الدالة لتسجيل الإيميل
          />
        )}

        {currentPage === 'verify-email' && (
          <VerifyEmail 
            email={registeredEmail} // 👈 تمرير الإيميل المسجل
            onVerificationSuccess={() => setCurrentPage('login')} // 👈 التوجيه لصفحة اللوجن عند النجاح
          />
        )}

        {currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'verify-email' && (
          <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
            {currentPage === 'home' && <Home />}
            {currentPage === 'settings' && <Settings />}
          </Layout>
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;