import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import db from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // رابط الفرونت أند المسموح له بالاتصال
  credentials: true,                // السماح بنقل الـ Cookies / Authorization Headers
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

db.connect()
    .then((client) =>{
        console.log("Connected successfully to DB");
    }).catch((err)=>{
        console.log("connection failed to DB");
    })

app.get("/", (req, res) => {
    res.send("Hello from the backend!");
})

app.listen(8000, () => {
    console.log("server is running on http://localhost:8000...")
})