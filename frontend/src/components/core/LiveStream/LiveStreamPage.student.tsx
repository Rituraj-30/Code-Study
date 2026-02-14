import  { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {  LogOut, Radio, Shield, Users, Wifi } from "lucide-react";
import { toast } from "react-hot-toast";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const LiveStreamStudentPage = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token, appId } = location.state || {};

  const [status, setStatus] = useState("Connecting...");
  const [isLive, setIsLive] = useState(false);
  const [userCount] = useState(1);

  const handleLeave = async () => {
    try {
      await client.leave();
    } catch (err) {}
    toast.success("Session exited");
    navigate("/dashboard/enrolled-courses");
  };

  useEffect(() => {
  if (!token || !appId) {
    toast.error("Access Denied: Missing Token");
    navigate("/dashboard/enrolled-courses"); 
    return; 
  }

    const setupStudentStream = async () => {
      try {
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            setIsLive(true);
            setStatus("LIVE");
            setTimeout(() => {
              user.videoTrack?.play("student-video-inner", { fit: "contain", 
  mirror: false });
            }, 300);
          }
          if (mediaType === "audio") user.audioTrack?.play();
        });


        
        client.on("user-left", async () => {
          setIsLive(false);
          setStatus("Ended");
          toast.error("Teacher left the session");
          await client.leave();
          setTimeout(() => navigate("/dashboard/enrolled-courses"), 2500);
        });

        await client.join(appId, roomId!, token, null);
        setStatus("Waiting...");
      } catch (err) {
        setStatus("Error");
        toast.error("Stream Connection Failed");
      }
    };

    setupStudentStream();
    return () => {
      client.removeAllListeners();
      client.leave();
    };
  }, [appId, roomId, token, navigate]);

  return (
    <div className="h-screen w-screen bg-[#020617] flex flex-col overflow-hidden font-sans text-slate-200">
      
      {/* 1. PREMIUM TOP HEADER */}
      <div className="fixed top-0 left-0 right-0 h-20 px-6 flex items-center justify-between z-[100] bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Shield className="text-cyan-400" size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              Class Room <span className="text-slate-500 text-xs font-normal">|</span> 
              <span className="text-cyan-400 font-mono uppercase">{roomId}</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                isLive ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
              }`}>
                {isLive && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                {status}
              </span>
              <span className="flex items-center gap-1 text-slate-400 text-[10px] bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                <Users size={10} /> {userCount} Watching
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLeave}
          className="group flex items-center gap-2 bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 px-5 py-2.5 rounded-2xl border border-white/10 hover:border-red-500/30 transition-all duration-300 text-xs font-bold shadow-xl active:scale-95"
        >
          <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
          Leave Class
        </button>
      </div>

      {/* 2. MAIN STREAM VIEWPORT */}
      <div className="flex-1 relative flex items-center justify-center p-4 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent" />
        
        <div
          id="student-video-inner"
          className={`relative w-full h-full max-w-6xl aspect-video bg-black rounded-[2rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden z-10 transition-all duration-1000 ${
            isLive ? "scale-100 opacity-100 ring-1 ring-white/10" : "scale-95 opacity-0"
          }`}
        />

        {/* 3. ELEGANT PLACEHOLDER */}
        {!isLive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="relative mb-8">
              <div className="absolute inset-0 blur-3xl bg-cyan-500/20 rounded-full animate-pulse" />
              <div className="relative w-24 h-24 flex items-center justify-center rounded-3xl bg-slate-900 border border-white/10 shadow-2xl">
                <Radio className="text-cyan-500 animate-bounce" size={40} />
              </div>
              <Wifi className="absolute -top-2 -right-2 text-cyan-400 animate-ping" size={20} />
            </div>
            <h2 className="text-white font-black text-2xl tracking-tight mb-2 uppercase">
              {status === "Waiting..." ? "Preparing Stream" : status}
            </h2>
            <p className="text-slate-400 text-sm font-medium max-w-[280px] text-center leading-relaxed">
              Establishing secure connection. Video will start once the instructor begins.
            </p>
            <div className="mt-10 flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. MINIMAL FOOTER DECOR */}
      <div className="h-12 flex items-center justify-center gap-8 bg-black/40 backdrop-blur-xl border-t border-white/5 px-10">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-cyan-400 rounded-full" />
            <p className="text-white/30 text-[9px] font-bold tracking-[0.3em] uppercase">Encrypted</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-cyan-400 rounded-full" />
            <p className="text-white/30 text-[9px] font-bold tracking-[0.3em] uppercase">1080p HD</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-cyan-400 rounded-full" />
            <p className="text-white/30 text-[9px] font-bold tracking-[0.3em] uppercase">Low Latency</p>
          </div>
      </div>
    </div>
  );
};

export default LiveStreamStudentPage;
