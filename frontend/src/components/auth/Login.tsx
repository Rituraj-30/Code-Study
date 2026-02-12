import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../services/authApi";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/slices/authSlice";
import { toast } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();
      dispatch(setToken(res.token));
      const expiryInDays = 3;
      const expiryTime = new Date().getTime() + expiryInDays * 24 * 60 * 60 * 1000;
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("expiry", expiryTime.toString());
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="relative w-full min-h-screen md:min-h-[calc(100vh-70px)] flex items-center justify-center px-4 bg-[#020617] py-10">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_45%)]" />

      {/* Card Container - Responsive Width */}
      <div className="relative w-full max-w-[400px] sm:max-w-[420px] rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/40 to-blue-500/10 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
        <div className="bg-[#020b1f]/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10">
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Welcome Back 👋
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 text-center mt-2">
            Login to continue your journey
          </p>

          <form onSubmit={handleOnSubmit} className="mt-8 space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                required
                type="email"
                placeholder="Enter your email"
                className="w-full h-11 bg-[#020617] text-white border border-white/10 rounded-lg pl-10 pr-4 text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full h-11 bg-[#020617] text-white border border-white/10 rounded-lg pl-10 pr-10 text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-cyan-500 text-black font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(34,211,238,0.45)] active:scale-[0.98] transition disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-[11px] sm:text-xs text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 transition font-medium">
              Create Account
            </Link>
          </p>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] sm:text-xs text-gray-400">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            className="w-full h-11 flex items-center justify-center gap-3 rounded-lg border border-white/10 bg-[#020617] text-white text-sm font-medium hover:bg-white/5 hover:border-cyan-400/40 transition"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;