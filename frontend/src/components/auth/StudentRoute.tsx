import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const StudentRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useSelector((state: any) => state.profile);
  const { token } = useSelector((state: any) => state.auth); 
  const location = useLocation();

  // 1. Loading state (Jab tak Redux user fetch kar raha hai)
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="loader border-t-cyan-500 animate-spin rounded-full h-10 w-10 border-4"></div>
      </div>
    );
  }

  // 2. Agar login hai aur Student hai toh access do
  if (token && user?.accountType === "Student") {
    return <>{children}</>;
  }

  if (token && user && user.accountType !== "Student") {
    toast.error("Access Denied! This page is only accessible to Students.");
    return <Navigate to="/dashboard/my-profile" state={{ from: location }} replace />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default StudentRoute;