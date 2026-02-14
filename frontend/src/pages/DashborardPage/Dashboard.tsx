import React from "react";
import { useSelector, useDispatch } from "react-redux"; 
import { Outlet, NavLink, useNavigate } from "react-router-dom"; 
import { 
  User, BookOpen, Settings, LogOut, 
  LayoutDashboard, ShoppingCart, GraduationCap, 
  Video, PlusCircle 
} from "lucide-react";
import HighlightText from "../../components/common/HighlightText";
import { setToken } from "../../redux/slices/authSlice"; // Navbar wala same import
import { toast } from "react-hot-toast";

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: any) => state.profile || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- LOGOUT FUNCTION (Same as Navbar) ---
  const handleLogout = () => {
    // 1. Redux Store clear karo
    dispatch(setToken(""));

    // 2. LocalStorage saaf karo
    localStorage.clear();

    toast.success("Logged out successfully");
    
    // 3. Redirect to login
    navigate("/login");
  };

  const sidebarLinks = [
    { id: 1, name: "My Profile", path: "/dashboard/my-profile", icon: User },
  ];

  if (user?.accountType === "Student") {
    sidebarLinks.push(
      { id: 2, name: "Enrolled Courses", path: "/dashboard/enrolled-courses", icon: BookOpen },
      { id: 3, name: "Live Class", path: "/dashboard/live-class", icon: Video },
      { id: 4, name: "Wishlist", path: "#", icon: ShoppingCart }
    );
  }

  if (user?.accountType === "Instructor") {
    sidebarLinks.push(
      { id: 5, name: "My Courses", path: "/dashboard/my-courses", icon: GraduationCap },
      { id: 6, name: "Add Course", path: "/dashboard/add-course", icon: PlusCircle },
      { id: 7, name: "Dashboard Stats", path: "#", icon: LayoutDashboard }
    );
  }
  if (user?.accountType === "Admin") {
    sidebarLinks.push(
      { id: 8, name: "Admin", path: "/admin-panel", icon: Settings }
    );
  }

  sidebarLinks.push({ id: 9, name: "Settings", path: "/dashboard/settings", icon: Settings });

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] bg-[#000814]">
      {/* SIDEBAR */}
      <div className="flex min-w-[220px] flex-col border-r border-white/10 bg-[#001428] py-8 hidden md:flex">
        <div className="px-6 mb-10">
          <h2 className="text-xl font-bold text-white tracking-tighter">
            Code<HighlightText text="Study" />
          </h2>
          <p className="text-[9px] text-cyan-500 uppercase tracking-[2px] mt-1 font-black">
            {user?.accountType} PANEL
          </p>
        </div>

        <div className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.id}
                to={link.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-x-3 px-6 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-cyan-500/10 text-cyan-400 border-r-2 border-cyan-500" 
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* LOGOUT BUTTON */}
        <div className="mt-auto px-6 pt-10 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-x-3 text-sm font-bold text-red-500 hover:text-red-400 transition-all w-full"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-[calc(100vh-3.5rem)] overflow-auto bg-[#000814]">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
