import bcrypt from "bcrypt";
import db from "../config/db.js";
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/sendEmail.js';
// register user
export const register = async (req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
        return res.status(400).json({ message: "please provide all required fields"});
    }
    
    
    try {
        const userExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({message: "user already exists"});
        }

        const round = 10;
        const hashedPassword = await bcrypt.hash(password,round);
        const verification_Code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        const newUser = await db.query("INSERT INTO users (name, email, password, verification_code, verification_expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, verification_code, is_verified",[name, email, hashedPassword, verification_Code, expiresAt]);
        await sendVerificationEmail(email, verification_Code);
        res.status(201).json({message: "user created successfully", user: newUser.rows[0]});
    }catch (error) {
        console.error(error);
        res.status(500).json({message: "server error"});
    }
}

// verify email
export const verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: "Email and code are required" });
    }

    try {
        // 1. البحث عن المستخدم بالبريد الإلكتروني أولاً
        const userResult = await db.query(
            "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
            [email.trim()]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = userResult.rows[0];

        // 2. إذا كان الحساب مفاداً وموثقاً مسبقاً
        if (user.is_verified) {
            return res.status(400).json({ message: "Account is already verified. Please login." });
        }

        // 3. طباعة للتتبع أثناء التطوير (في تيرمينال الـ Backend)
        console.log("DB Code:", user.verification_code, "| Received Code:", code);

        // 4. التحقق من تطابق الرمز (تحويل الطرفين إلى النصوص وتجريدهما من المسافات)
        if (!user.verification_code || String(user.verification_code).trim() !== String(code).trim()) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        // 5. التحقق من الصلاحية باستخدام getTime() لتفادي مشاكل الفارق الزمني (Timezone)
        const currentTime = new Date().getTime();
        const expiryTime = new Date(user.verification_expires_at).getTime();

        if (currentTime > expiryTime) {
            return res.status(400).json({ message: "The code has expired; please request a new code." });
        }

        // 6. تفعيل الحساب وتصفير الرمز
        await db.query(
            "UPDATE users SET is_verified = true, verification_code = NULL, verification_expires_at = NULL WHERE id = $1",
            [user.id]
        );

        return res.status(200).json({ message: "Account verified successfully!" });

    } catch (error) {
        console.error("Verification Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

// resend verification code
export const resendVerificationCode = async (req, res) => {
    const {email} = req.body;
    
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({message: "user not found"});
        }
        const userData = user.rows[0];
        if (userData.is_verified) {
            return res.status(400).json({message: "Account is already verified. You can Log in"});
        }
        else {
            const verification_Code = Math.floor(100000 + Math.random()* 900000).toString();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            await db.query("UPDATE users SET verification_code = $1,  verification_expires_at = $2 WHERE email = $3", [verification_Code, expiresAt, email]);
            await sendVerificationEmail(email, verification_Code);
            res.status(200).json({message: "Verification code resent successfully."});
        }
    }catch (error) {
        console.error(error);
        return res.status(500).json({message: "server error"});
    }
}

// login user
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "please enter all required fields" });
    }
    try {
        const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "invalid credentials" });
        }

        const userData = user.rows[0];

        /*/ 🛑 فحص هل الحساب موثق أم لا
        if (!userData.is_verified) {
            return res.status(403).json({ 
                message: "Your account is not verified. Please check your email for the verification code.",
                isNotVerified: true,
                email: userData.email 
            });
        }*/

        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(400).json({ message: "invalid password" });
        }

        res.status(200).json({ message: "login successful", user: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" });
    }
}

// get user
export const getUser = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({message: "user not found"});
        }
        res.status(200).json({user: user.rows[0]});
    }catch (error) {
        console.error(error);
        res.status(500).json({message: "server error"});
    }
}

// logout user
export const logout = async (req, res) => {
    try {
        res.status(200).json({message: "logout successful"});
    }catch (error) {
        console.error(error);
        res.status(500).json({message: "server error"});
    }
}

// update user
export const updateUser = async (req, res) => {
    const {id} = req.params;
    const {name, email} = req.body || {};
    try{
        const user = await db.query("UPDATE users SET name =$1,email = $2 WHERE id =$3 RETURNING *",[name, email, id]);
        res.status(200).json({message: "user updated successfully", user: user.rows[0]});
    }catch (error) {
        console.error(error);
        res.status(500).json({message: "server error"});
    }
}

//delete user
export const deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await db.query("DELETE FROM users WHERE id = $1 RETURNING *",[id]);
        if (user.rows.length === 0) {
            return res.status(404).json({message: "user not found"});
        }
        res.status(200).json({message: "user deleted successfully"});
    }catch (error) {
        console.error(error);
        res.status(500).json({message: "server error"});
    }
}

