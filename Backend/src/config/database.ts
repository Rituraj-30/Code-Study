import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URL;

    if (!mongoURI) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }

    await mongoose.connect(mongoURI);
    console.log("✅ DB Connected Successfully");
  } catch (error) {
    console.error("❌ DB Connection Failed");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;




// import mongoose from "mongoose";

// const fixDatabase = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URL!); // Use your DB URL
//         console.log("DB Connected for cleanup");

//         const collection = mongoose.connection.collection("liveclasses");
        
//         // This is the line that solves your terminal error
//         await collection.dropIndex("joinedStudents_1");
        
//         console.log("Ghost index 'joinedStudents_1' removed successfully!");
//         process.exit(0);
//     } catch (error: any) {
//         console.error("Error or index already gone:", error.message);
//         process.exit(1);
//     }
// };

// fixDatabase();