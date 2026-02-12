import { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { 
    MonitorUp, PhoneOff, Mic, MicOff, Video, 
    VideoOff, ShieldCheck,Users, Loader2 
} from "lucide-react";
import { toast } from "react-hot-toast";
import ConfirmationModal from "../../common/ConfirmationModal";
// Apne actual path se import karein
import { useEndLiveClassMutation } from "../../../services/authApi"; 

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const LiveStreamPage = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
      const [userCount] = useState(1);
    
    const { token, appId, role } = location.state || {};

    // RTK Query Mutation
    const [endLiveClass, { isLoading: isEnding }] = useEndLiveClassMutation();

    const [localTracks, setLocalTracks] = useState<any>(null);
    const [screenTrack, setScreenTrack] = useState<any>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const startStream = async () => {
            if (!token || !appId) {
                toast.error("Invalid Session or Missing Token");
                return navigate("/dashboard/my-courses");
            }

            try {
                // 1. Join Agora Channel
                await client.join(appId, roomId!, token, null);

                if (role === 'publisher') {
                    // 2. Create Audio & Video Tracks
                    const [audio, video] = await AgoraRTC.createMicrophoneAndCameraTracks(
                        { encoderConfig: "high_quality" },
                        { encoderConfig: "720p_1" } 
                    );
                    
                    setLocalTracks([audio, video]);
                    
                    // 3. Publish to Channel
                    await client.publish([audio, video]);
                    
                    // 4. Play Local Video
                    video.play("video-box", { fit: "cover" });
                } else {
                    // For Students (if they land here)
                    client.on("user-published", async (user, mediaType) => {
                        await client.subscribe(user, mediaType);
                        if (mediaType === "video") user.videoTrack?.play("video-box", { fit: "contain" });
                        if (mediaType === "audio") user.audioTrack?.play();
                    });
                }
            } catch (err) {
                console.error("STREAM_START_ERROR:", err);
                toast.error("Could not start live stream");
            }
        };

        startStream();

        return () => {
            // Cleanup on Unmount
            localTracks?.forEach((t: any) => { t.stop(); t.close(); });
            if (screenTrack) { screenTrack.stop(); screenTrack.close(); }
            client.leave();
        };
    }, []);

    //  SCREEN SHARE LOGIC
    const toggleScreen = async () => {
        try {
            if (!isSharing) {
                const track: any = await AgoraRTC.createScreenVideoTrack({
                    encoderConfig: "1080p_1",
                    optimizationMode: "detail"
                }, "auto");

                if (localTracks?.[1]) {
                    await client.unpublish(localTracks[1]);
                }

                await client.publish(track);
                track.play("video-box", { fit: "contain" });

                setScreenTrack(track);
                setIsSharing(true);

                track.on("track-ended", () => {
                    handleStopSharing(track);
                });
            } else {
                await handleStopSharing(screenTrack);
            }
        } catch (err) {
            console.error(err);
            toast.error("Screen sharing failed");
        }
    };

    const handleStopSharing = async (track: any) => {
        if (!track) return;
        await client.unpublish(track);
        track.stop();
        track.close();
        setScreenTrack(null);
        setIsSharing(false);

        if (localTracks?.[1]) {
            await client.publish(localTracks[1]);
            localTracks[1].play("video-box", { fit: "cover" });
        }
    };

    // ✅ CONNECTED END CLASS LOGIC
    const handleEndClass = async () => {
        try {
            // 1. Backend Update (DB me isLive: false karein)
            await endLiveClass({ roomId }).unwrap();

            // 2. Stop tracks
            localTracks?.forEach((t: any) => { t.stop(); t.close(); });
            if (screenTrack) { screenTrack.stop(); screenTrack.close(); }

            // 3. Leave Agora (This triggers "user-left" for students)
            await client.leave();

            // 4. UI Feedback & Redirect
            setIsModalOpen(false);
            toast.success("Class ended successfully");
            navigate("/dashboard/my-courses");

        } catch (err: any) {
            console.error("END_CLASS_API_ERROR:", err);
            toast.error(err?.data?.message || "Failed to end session in database");
        }
    };

    return (
        <div className="fixed inset-0 bg-[#020617] flex flex-col z-[999] font-sans">
            {/* TOP BAR */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900/40 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                        <ShieldCheck className="text-cyan-400" size={22} />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg tracking-tight">
                            Room: <span className="text-cyan-400">{roomId}</span>
                        </h1>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">
                            Instructor Console • HD
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Live</span>
                    <span className="flex items-center gap-1 text-slate-400 text-[10px] bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                    <Users size={10} /> {userCount} Watching
                                  </span>
                </div>
            </div>

            {/* VIDEO AREA */}
            <div className="flex-1 relative p-4 md:p-8 flex items-center justify-center">
                <div id="video-box" className="w-full h-full max-w-5xl aspect-video bg-black rounded-3xl shadow-2xl border border-white/5 overflow-hidden relative">
                    {(isCameraOff && !isSharing) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617] z-10">
                            <VideoOff size={44} className="text-slate-700 mb-4" />
                            <p className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">Camera Turned Off</p>
                        </div>
                    )}
                </div>
            </div>

            {/* CONTROLS (Only for Instructor) */}
            {role === 'publisher' && (
                <div className="pb-10 pt-2 flex justify-center px-4">
                    <div className="flex items-center gap-3 md:gap-5 bg-slate-900/80 backdrop-blur-3xl p-3 rounded-[2.5rem] border border-white/10 shadow-2xl">
                        <button onClick={() => { localTracks?.[0]?.setMuted(!isMuted); setIsMuted(!isMuted); }}
                            className={`p-4 rounded-full transition-all active:scale-90 ${isMuted ? 'bg-red-500 text-white' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                        </button>

                        <button onClick={() => { localTracks?.[1]?.setEnabled(isCameraOff); setIsCameraOff(!isCameraOff); }}
                            className={`p-4 rounded-full transition-all active:scale-90 ${isCameraOff ? 'bg-red-500 text-white' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                            {isCameraOff ? <VideoOff size={22} /> : <Video size={22} />}
                        </button>

                        <button onClick={toggleScreen}
                            className={`p-4 rounded-full transition-all active:scale-90 ${isSharing ? 'bg-cyan-500 text-black shadow-lg' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                            <MonitorUp size={22} />
                        </button>

                        <div className="w-px h-10 bg-white/10 mx-2" />

                        <button 
                            disabled={isEnding}
                            onClick={() => setIsModalOpen(true)}
                            className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full font-black text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {isEnding ? <Loader2 className="animate-spin" size={20} /> : <PhoneOff size={20} />} 
                            END CLASS
                        </button>
                    </div>
                </div>
            )}

            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleEndClass}
                title="End Live Session?"
                message="Are you sure? This will disconnect all students and end the session."
            />
        </div>
    );
};

export default LiveStreamPage;