import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStartLiveClassMutation } from "../../../services/authApi"; 
import { toast } from "react-hot-toast";
import { Video, Hash, Loader2, ArrowLeft, Lock, Sparkles } from "lucide-react";

const LiveClassSetup: React.FC = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        title: "",
        roomId: `room_${Math.floor(1000 + Math.random() * 9000)}`, 
        roomPassword: ""
    });

    const [startLive, { isLoading }] = useStartLiveClassMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!formData.title || !formData.roomId || !formData.roomPassword) {
            return toast.error("Please fill all fields");
        }

        try {
            const response = await startLive({ courseId, ...formData }).unwrap();
            toast.success("Class Started Successfully!");
            
            navigate(`/live-stream/instructor/${formData.roomId}`, { 
                state: { 
                    token: response.token, 
                    appId: response.appId,
                    role: 'publisher',
                    title: formData.title
                } 
            });
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to start live class");
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
                    <div className="bg-cyan-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-cyan-500/20 shadow-inner">
                        <Video className="text-cyan-400" size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Setup Live Class</h1>
                    <p className="text-gray-400 text-[11px] mt-1">Configure your session details below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest">Class Title</label>
                        <div className="relative mt-1">
                            <input 
                                type="text"
                                placeholder="e.g. Mastering React Hooks"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-10 focus:border-cyan-500/50 outline-none transition-all text-sm text-white placeholder:text-gray-600"
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                            <Sparkles className="absolute left-3 top-3 text-gray-500" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest">Room ID</label>
                        <div className="relative mt-1">
                            <input 
                                type="text"
                                value={formData.roomId}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-10 focus:border-cyan-500/50 outline-none transition-all text-sm text-white"
                                onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                            />
                            <Hash className="absolute left-3 top-3 text-gray-500" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-widest">Access Password</label>
                        <div className="relative mt-1">
                            <input 
                                type="password"
                                placeholder="Create a room password"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-10 focus:border-cyan-500/50 outline-none transition-all text-sm text-white placeholder:text-gray-600"
                                onChange={(e) => setFormData({...formData, roomPassword: e.target.value})}
                            />
                            <Lock className="absolute left-3 top-3 text-gray-500" size={16} />
                        </div>
                    </div>

                    <button disabled={isLoading} type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2 shadow-lg shadow-cyan-500/20 text-xs uppercase tracking-wider">
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Go Live Now 🚀"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LiveClassSetup;