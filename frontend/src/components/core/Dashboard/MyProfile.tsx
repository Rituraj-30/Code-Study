import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Edit3, Mail, User as UserIcon, Phone, Calendar, ShieldCheck, CheckCircle2 } from "lucide-react";
import { getUserDetails } from "../../../services/operations/profileAPI";

const MyProfile = () => {
  const { user, loading } = useSelector((state: any) => state.profile);
  const { token } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // @ts-ignore
      dispatch(getUserDetails(token, navigate));
    }
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><div className="w-8 h-8 border-2 border-t-cyan-500 rounded-full animate-spin"></div></div>;

  return (
    
    <div className="mx-auto w-full max-w-[1000px] space-y-6 px-6 pb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white md:text-2xl">My Profile</h1>
        <button 
          onClick={() => navigate("/dashboard/settings")}
          className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-[#000814] transition-all hover:bg-cyan-400 active:scale-95 shadow-lg shadow-cyan-500/20"
        >
          <Edit3 size={16} /> <span>Edit Profile</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/5 bg-[#001428] p-6 sm:flex-row">
        <div className="relative">
          <img 
            src={user?.image} 
            alt="profile" 
            className="h-20 w-20 rounded-2xl border border-white/10 object-cover"
          />
          <div className="absolute -bottom-1 -right-1 rounded-md border-2 border-[#001428] bg-green-500 p-0.5">
            <ShieldCheck size={12} className="text-white" />
          </div>
        </div>
        
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
            <p className="text-xs text-gray-400">{user?.email}</p>
            <span className="hidden h-1 w-1 rounded-full bg-gray-600 sm:block"></span>
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/20">
              {user?.accountType}
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-white/5 bg-[#001428] p-6">
          <h3 className="mb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">About</h3>
          <p className="text-sm leading-relaxed text-gray-300">
            {user?.additionalDetails?.about || "Write something about yourself..."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#001428] p-6">
          <h3 className="mb-5 text-[10px] font-black uppercase tracking-widest text-cyan-500">Account Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Joined</span>
              <span className="text-gray-200 text-xs font-medium">{formatDate(user?.createdAt)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs">Verification</span>
              <div className="flex items-center gap-1">
                <span className="text-green-500 text-xs font-bold uppercase">Verified</span>
                <CheckCircle2 size={14} className="text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Info Rows */}
        <div className="rounded-2xl border border-white/5 bg-[#001428] p-6">
            <h3 className="mb-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Contact</h3>
            <div className="space-y-5">
                <div className="flex items-start gap-4">
                    <Mail size={16} className="text-gray-500" />
                    <div>
                        <p className="text-[9px] font-bold uppercase text-gray-600">Email</p>
                        <p className="text-xs text-gray-200 truncate max-w-[150px]">{user?.email}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <Phone size={16} className="text-gray-500" />
                    <div>
                        <p className="text-[9px] font-bold uppercase text-gray-600">Phone</p>
                        <p className="text-xs text-gray-200">{user?.additionalDetails?.contactNumber || "N/A"}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#001428] p-6">
            <h3 className="mb-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Personal Details</h3>
            <div className="space-y-5">
                <div className="flex items-start gap-4">
                    <UserIcon size={16} className="text-gray-500" />
                    <div>
                        <p className="text-[9px] font-bold uppercase text-gray-600">Gender</p>
                        <p className="text-xs text-gray-200">{user?.additionalDetails?.gender || "Not Set"}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <Calendar size={16} className="text-gray-500" />
                    <div>
                        <p className="text-[9px] font-bold uppercase text-gray-600">Birthday</p>
                        <p className="text-xs text-gray-200">{user?.additionalDetails?.dateOfBirth || "Not Set"}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-6">
          <h3 className="mb-2 text-[10px] font-black uppercase tracking-widest text-cyan-500">Quick Tip</h3>
          <p className="text-xs text-gray-400">Keep your profile updated to get personalized course suggestions.</p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;