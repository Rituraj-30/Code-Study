import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import fileUpload from "express-fileupload";

import connectDB from "./config/database";
import { cloudinaryConnect } from './config/cloudinary';

import profileRoutes from "./routes/Profile.Route";
import authRoutes from "./routes/user.Route";
import adminRoutes from "./routes/admin.Route";
import courseRoutes from "./routes/course.Route";
import paymentRoutes from "./routes/payment.Routes";

import LiveClass from "./routes/liveClass.routes"


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); 
app.use(cookieParser());

app.use(
  cors({
   origin: ["https://code-study-puce.vercel.app", "http://localhost:5173"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp'
  })
);

app.get("/", (_req, res) => {
  res.send("🚀 TypeScript Backend Running");
});

//  Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth/course", courseRoutes);
app.use('/api/v1/profile', profileRoutes); 
app.use("/api/v1/auth/payment",paymentRoutes)
app.use("/api/v1/auth/liveClass",LiveClass)

app.use('/api/v1/auth/admin', adminRoutes);



connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      cloudinaryConnect();
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start server", error);
    process.exit(1);
  });
