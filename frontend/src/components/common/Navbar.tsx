import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux"; 
import { setToken } from "../../redux/slices/authSlice"; 
import logo from "../../assets/img/logo.png";

interface NavLink {
  title: string;
  path: string;
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [token, setTokenState] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setTokenState(localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    dispatch(setToken(null));
    localStorage.clear();
    setTokenState(null);
    setUser(null);
    toast.success("Logged out successfully");
    setMenuOpen(false);
    navigate("/login");
  };

  const NavLinks: NavLink[] = [
    { title: "Home", path: "/" },
    { title: "Courses", path: "/courses" },
    { title: "Notes", path: "/notes" },
    { title: "Contact", path: "/contact" },
    { title: "About Us", path: "/about" },
  ];

  const activeLink = (path: string) =>
    location.pathname === path
      ? "text-cyan-400 font-semibold"
      : "text-gray-300 hover:text-white transition-all";

  return (
    <nav className="w-full bg-[#000814]/90 border-b border-white/10 sticky top-0 z-[100] backdrop-blur-md">
      <div className="max-w-[1260px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center group shrink-0">
          <img
            src={logo}
            alt="logo"
            className="h-8 sm:h-9 w-auto object-contain filter brightness-110 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all"
          />
        </Link>

        {/* DESKTOP LINKS */}
        <ul className="hidden lg:flex items-center gap-8 xl:gap-10 text-[15px] font-medium">
          {NavLinks.map((link) => (
            <li key={link.path}>
              <Link to={link.path} className={activeLink(link.path)}>
                {link.title}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3 sm:gap-5">
          {token ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <Link to="#" className="relative text-gray-300 hover:text-cyan-400 transition-colors">
                <AiOutlineShoppingCart size={22} className="sm:w-6 sm:h-6" />
              </Link>

              <div className="relative group">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-white/20 flex items-center justify-center cursor-pointer hover:border-cyan-400 transition-all">
                  {user?.image ? (
                    <img src={user.image} alt="user" className="h-full w-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold uppercase">
                      {user?.firstName?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                
                {/* Dropdown - Desktop Only */}
                <div className="hidden lg:block absolute right-0 mt-2 w-44 bg-[#000d1f] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  <Link to="/dashboard/my-profile" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white">My Profile</Link>
                  <Link to="/dashboard" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white">Dashboard</Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 border-t border-white/5"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/login">
                <button className="px-4 py-2 text-sm font-medium text-gray-300 border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition-all">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-5 py-2 text-sm font-bold text-black bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all">
                  Signup
                </button>
              </Link>
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-white p-1 hover:bg-white/5 rounded-md transition-colors">
            {menuOpen ? <HiX size={26} /> : <HiMenuAlt3 size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`lg:hidden absolute w-full left-0 bg-[#000814] border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out ${menuOpen ? "top-16 opacity-100 visible" : "top-[-400px] opacity-0 invisible"}`}>
        <ul className="flex flex-col items-center gap-5 py-8">
          {NavLinks.map((link) => (
            <li key={link.path}>
              <Link to={link.path} onClick={() => setMenuOpen(false)} className={`${activeLink(link.path)} text-lg`}>
                {link.title}
              </Link>
            </li>
          ))}
          
          <div className="w-full px-8 flex flex-col gap-3 mt-4">
            {token ? (
              <>
                <Link to="/dashboard/my-profile" onClick={() => setMenuOpen(false)} className="w-full py-3 text-center text-gray-300 border border-white/10 rounded-xl">Profile</Link>
                <button onClick={handleLogout} className="w-full py-3 bg-red-500/10 text-red-500 font-bold rounded-xl border border-red-500/20">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full">
                  <button className="w-full py-3 border border-white/10 text-white rounded-xl">Login</button>
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="w-full">
                  <button className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold rounded-xl">Signup</button>
                </Link>
              </>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;