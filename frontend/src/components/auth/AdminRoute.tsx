import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  // Redux state se data fetch karna
  const { user, loading } = useSelector((state: any) => state.profile);
  const { token } = useSelector((state: any) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#000814]">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  //  Agar token hai aur accountType 'Admin' hai toh access do
  if (token && user?.accountType === "Admin") {
    return <>{children}</>;
  }

  //  Agar logged in hai par Admin nahi hai (Access Denied)
  if (token && user && user.accountType !== "Admin") {
    toast.error("Restricted Area! Admins only.");
    return <Navigate to="/dashboard/my-profile" state={{ from: location }} replace />;
  }

  // . Agar login hi nahi hai
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminRoute;