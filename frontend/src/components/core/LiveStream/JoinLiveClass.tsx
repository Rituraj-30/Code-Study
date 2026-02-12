import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useJoinLiveClassMutation } from "../../../services/authApi"; // RTK Query Hook
import { Lock, Hash, Loader2, ArrowLeft, PlayCircle } from "lucide-react";

const JoinLiveClass = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ roomId: "", password: "" });
    
    // RTK Query hook use kar rahe hain
    const [joinLive, { isLoading }] = useJoinLiveClassMutation();

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if(!formData.roomId || !formData.password) {
            return toast.error("Room ID aur Password are required!");
        }

        try {
            // Backend call via RTK Query
            const response = await joinLive(formData).unwrap();

            if (response.success) {
                toast.success("Access Granted! Connecting...");
                
                navigate(`/live-stream/student/${formData.roomId}`, {
                    state: {
                        token: response.token,      
                        appId: response.appId,      
                        role: 'subscriber',         
                        title: response.title || "Live Session"
                    }
                });
            }
        } catch (error: any) {
            console.error("JOIN_ERROR", error);
            const errorMsg = error?.data?.message || "Invalid Room ID or Password";
            toast.error(errorMsg);
        }
    };

    return (
        <div className="w-full flex justify-center items-start pt-2 px-4 font-sans">
            <div className="w-full max-w-md bg-[#020617] border border-white/10 p-6 rounded-3xl shadow-2xl relative overflow-hidden mt-4">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full"></div>

                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white mb-4 transition-colors text-xs font-medium relative z-10">
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="text-center mb-6 relative z-10">
                    <div className="bg-cyan-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-cyan-500/20">
                        <PlayCircle className="text-cyan-400" size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Join Live Class</h1>
                    <p className="text-gray-400 text-[11px] mt-1">Enter credentials to attend class</p>
                </div>

                <form onSubmit={handleJoin} className="space-y-4 relative z-10">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest">Room ID</label>
                        <div className="relative mt-1">
                            <input name="roomId" type="text" value={formData.roomId} onChange={handleOnChange} placeholder="Enter Room ID" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-10 focus:border-cyan-500/50 outline-none text-sm text-white" />
                            <Hash className="absolute left-3 top-3 text-gray-500" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest">Password</label>
                        <div className="relative mt-1">
                            <input name="password" type="password" value={formData.password} onChange={handleOnChange} placeholder="Enter Password" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-10 focus:border-cyan-500/50 outline-none text-sm text-white" />
                            <Lock className="absolute left-3 top-3 text-gray-500" size={16} />
                        </div>
                    </div>

                    <button disabled={isLoading} type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2 shadow-lg shadow-cyan-500/20 text-xs uppercase tracking-wider">
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Join Stream Now"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JoinLiveClass;