import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../services/authApi";
import { toast } from "react-hot-toast";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const { state } = useLocation(); // Signup page se data yahan aayega
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Signup data + OTP dono backend ko bhejenge
      const finalData = { ...state.signupData, otp };
      await signup(finalData).unwrap();
      
      toast.success("Signup Successful! Please Login.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-[#000814] flex items-center justify-center text-white">
      <form onSubmit={handleVerify} className="bg-[#000d1f] p-8 rounded-2xl border border-white/10 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Verify Email</h2>
        <p className="text-gray-400 mb-6">Enter the OTP sent to {state?.signupData?.email}</p>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          className="w-full bg-[#001529] border border-white/10 p-3 rounded-lg mb-4 text-center text-xl tracking-widest"
          required
        />
        <button 
          disabled={isLoading}
          className="w-full bg-cyan-500 text-black font-bold py-3 rounded-lg hover:bg-cyan-400 transition-all"
        >
          {isLoading ? "Verifying..." : "Confirm Signup"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;