import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom"; // Navigation ke liye
import type { ReactNode } from "react";
import { RootState } from "../../redux/store";
import { useEffect } from "react";

interface Props {
  children: ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.token) || localStorage.getItem("token");
  
  // console.log("private routes -> ", token);

  // console.log("children ->", children)
  useEffect(() => {
    if (!token) {
      // toast.error("Please login to access this course");
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;