import React, { useState } from 'react';
import { useUpdatePasswordMutation } from '../../services/authApi'; 
import { toast } from 'react-hot-toast';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const { oldPassword, newPassword, confirmPassword } = formData;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const toastId = toast.loading("Updating...");
    try {
      await updatePassword({ oldPassword, newPassword, confirmPassword }).unwrap();
      toast.success("Password Updated!", { id: toastId });
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => navigate("/dashboard/my-profile"), 2000);
    } catch (error: any) {
      toast.error(error?.data?.message || "Error updating password", { id: toastId });
    }
  };

  const toggleVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <>
      {/* Inline CSS for scrollbar hide and layout resets */}
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scroll-container { overflow: hidden !important; height: auto; }
      `}} />

      {/* Main Container */}
      <div className="flex items-start justify-center min-h-screen md:min-h-fit p-4 sm:p-6 scrollbar-hide hide-scroll-container">
        
        {/* Card Container with subtle glow */}
        <div className="relative w-full max-w-md mt-2 md:mt-10">
          <div className="absolute -inset-0.5 bg-cyan-500/10 rounded-2xl blur-md"></div>
          
          <div className="relative w-full bg-[#000d1f] border border-white/10 rounded-2xl shadow-2xl transition-all">
            
            {/* Header Section */}
            <div className="p-5 pb-0">
               <button 
                 onClick={() => navigate(-1)}
                 className="flex items-center gap-1 text-gray-500 hover:text-cyan-400 transition-colors text-xs mb-3"
               >
                 <ChevronLeft size={16} /> Back
               </button>
               
               <div className="flex items-center gap-4 mb-4">
                  <div className="p-2.5 bg-cyan-500/10 rounded-xl">
                    <ShieldCheck className="text-cyan-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white leading-tight">Security Settings</h2>
                    <p className="text-xs text-gray-400">Update your account password</p>
                  </div>
               </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleOnSubmit} className="p-5 pt-2 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 uppercase ml-1 tracking-wider">Current Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-cyan-500 transition-colors" size={16} />
                  <input
                    required
                    type={showPasswords.old ? "text" : "password"}
                    name="oldPassword"
                    value={oldPassword}
                    onChange={handleOnChange}
                    placeholder="••••••••"
                    className="w-full bg-[#001529]/40 border border-white/5 text-white text-sm rounded-xl py-2.5 pl-10 pr-10 focus:outline-none focus:border-cyan-500/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility('old')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                  >
                    {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent my-2"></div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 uppercase ml-1 tracking-wider">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-cyan-500 transition-colors" size={16} />
                  <input
                    required
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={newPassword}
                    onChange={handleOnChange}
                    placeholder="New password"
                    className="w-full bg-[#001529]/40 border border-white/5 text-white text-sm rounded-xl py-2.5 pl-10 pr-10 focus:outline-none focus:border-cyan-500/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 uppercase ml-1 tracking-wider">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-cyan-500 transition-colors" size={16} />
                  <input
                    required
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleOnChange}
                    placeholder="Confirm password"
                    className="w-full bg-[#001529]/40 border border-white/5 text-white text-sm rounded-xl py-2.5 pl-10 pr-10 focus:outline-none focus:border-cyan-500/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                 <button
                   type="button"
                   onClick={() => navigate(-1)}
                   className="order-2 sm:order-1 flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-3 rounded-xl border border-white/10 transition-all"
                 >
                   Cancel
                 </button>
                 <button
                   disabled={isLoading}
                   type="submit"
                   className="order-1 sm:order-2 flex-[2] bg-gradient-to-r from-cyan-500 to-blue-600 text-[#000814] text-xs font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-cyan-500/20"
                 >
                   {isLoading ? <Loader2 className="animate-spin" size={16} /> : "SAVE CHANGES"}
                 </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;