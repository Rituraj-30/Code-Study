import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useEffect, type ReactNode } from "react"; 
import type { RootState } from "../../redux/store"; 

interface Props {
  children: ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  // TypeScript ko batana padega ki token string ya null hai
  const token = useSelector((state: RootState) => state.auth.token) || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      // console.log("User not authenticated");
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;