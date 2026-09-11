import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

axios.defaults.withCredentials = true;

export const authService = {
    register: async (userData) => {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    },

    verifyEmail: async (email, code) => {
        const response = await axios.post(`${API_URL}/verify-email`, {email, code});
        return response.data;
    },

    resendVerificationCode: async (email) => {
        const response = await axios.post(`${API_URL}/resend-code`,{email});
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await axios.post(`${API_URL}/forgot-password`,{email});
        return response.data;
    },
    resetPassword: async (email,code,newpassword) => {
        const response = await axios.post(`${API_URL}/reset-password`,{email,code,newpassword});
        return response.data;
    },

    login: async (userData) => {
        const response = await axios.post(`${API_URL}/login`, userData);
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    getCurrentUser: async () => {
        const userObj = JSON.parse(localStorage.getItem('user'));
        if (!userObj || !userObj.id) return null;

        const response = await axios.get(`${API_URL}/user/${userObj.id}`);
        return response.data;
    },

    logout: async () => {
        localStorage.removeItem('user');
        await axios.post(`${API_URL}/logout`);
    },

    updateUser: async (userData) => {
        const userObj = JSON.parse(localStorage.getItem('user'));
        if (!userObj || !userObj.id) throw new Error("User ID not found");

        const response = await axios.put(`${API_URL}/user/${userObj.id}`, userData);
        
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    deleteUser: async () => {
        const userObj = JSON.parse(localStorage.getItem('user'));
        if (!userObj || !userObj.id) throw new Error("User ID not found");

        const response = await axios.delete(`${API_URL}/user/${userObj.id}`);
        localStorage.removeItem('user');
        return response.data;
    }
};