import { useSelector } from "react-redux"; // FIX: react-redux se aayega
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const InstructorRoute = ({ children }: { children: React.ReactNode }) => {
  // Redux state se data nikalna
  const { user, loading } = useSelector((state: any) => state.profile);
  const { token } = useSelector((state: any) => state.auth); // Token bhi check karna zaroori hai
  const location = useLocation();

  // 1. Loading state handle karna (Blank screen se bachata hai)
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="spinner text-white text-xl">Loading...</div>
      </div>
    );
  }

  // 2. Agar token hai aur accountType Instructor hai toh access do
  if (token && user?.accountType === "Instructor") {
    return <>{children}</>;
  }

  // 3. Agar accountType Instructor nahi hai
  if (token && user && user.accountType !== "Instructor") {
    toast.error("Access Denied! This area is reserved for Instructors only.");
    return <Navigate to="/dashboard/my-profile" state={{ from: location }} replace />;
  }

  // 4. Agar user login hi nahi hai (Bina token ke)
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default InstructorRoute;