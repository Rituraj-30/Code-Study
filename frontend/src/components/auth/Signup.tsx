import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react";
import { useSendOtpMutation } from "../../services/authApi";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("Student");
  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    try {
      await sendOtp(formData.email).unwrap();
      toast.success("OTP sent to your email!");
      navigate("/verify-otp", {
        state: { signupData: { ...formData, accountType } },
      });
    } catch (err: any) {
      toast.error(err.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="relative w-full min-h-screen md:min-h-[calc(100vh-70px)] flex items-center justify-center px-4 bg-[#020617] py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_45%)]" />

      <div className="relative w-full max-w-[400px] sm:max-w-[450px] rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/40 to-blue-500/10 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
        <div className="bg-[#020b1f]/95 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10">
          
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
            Create Account
          </h2>
          
          <div className="flex bg-[#020617] p-1 rounded-full border border-white/10 mt-6 mb-6 w-fit mx-auto">
            {["Student", "Instructor"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setAccountType(type)}
                className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  accountType === type ? "bg-cyan-500 text-black" : "text-gray-400 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <form onSubmit={handleOnSubmit} className="space-y-4">
            {/* Name Fields - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  required
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleOnChange}
                  className="w-full h-11 bg-[#020617] text-white border border-white/10 rounded-lg pl-10 pr-4 text-sm outline-none focus:border-cyan-400 transition"
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  required
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleOnChange}
                  className="w-full h-11 bg-[#020617] text-white border border-white/10 rounded-lg pl-10 pr-4 text-sm outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>
            
            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                required
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleOnChange}
                className="w-full h-11 bg-[#020617] text-white border border-white/10 rounded-lg pl-10 pr-4 text-sm outline-none focus:border-cyan-400 transition"
              />
            </div>
            
            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleOnChange}
                className="w-full h-11 bg-[#020617] text-white border border-white/10 rounded-lg pl-10 pr-10 text-sm outline-none focus:border-cyan-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                required
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleOnChange}
                className="w-full h-11 bg-[#020617] text-white border border-white/10 rounded-lg pl-10 pr-4 text-sm outline-none focus:border-cyan-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-cyan-500 text-black font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(34,211,238,0.45)] active:scale-[0.98] transition disabled:bg-gray-600 flex items-center justify-center gap-2"
            >
              {isLoading ? "Sending OTP..." : (
                <>
                  Next Step <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] sm:text-xs text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition font-medium">
              Login
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

export default Signup;