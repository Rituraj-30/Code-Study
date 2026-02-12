import React, { useState } from "react";
import { X, Video, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom"; 

interface LectureModalProps {
  onClose: () => void;
  onSave: (data: {
    title: string;
    courseId: string;
    desc: string;
    video: File;
  }) => Promise<void> | void;
}

const LectureModal: React.FC<LectureModalProps> = ({ onClose, onSave }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    
    if (!title || !video || !courseId) return;

    setLoading(true);
    await onSave({ title, courseId, desc, video }); 
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
      <div className="bg-[#000d1f] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-white/5">
          <h3 className="font-bold text-white text-sm">Add Lecture</h3>
          <X
            className="cursor-pointer text-gray-400 hover:text-white"
            size={18}
            onClick={onClose}
          />
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">

          {/* VIDEO UPLOAD */}
          <label className="w-full h-32 bg-[#000814] rounded-xl flex flex-col items-center justify-center border border-dashed border-white/10 cursor-pointer hover:border-cyan-500/40 transition">
            <Video size={26} className="text-cyan-500 mb-1" />
            <span className="text-[11px] text-gray-400 font-semibold text-center px-4 truncate w-full">
              {video ? video.name : "Click to upload lecture video"}
            </span>
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={(e) => setVideo(e.target.files?.[0] || null)}
            />
          </label>

          {/* TITLE */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-cyan-400 uppercase ml-1">
              Lecture Title
            </label>
            <input
              className="w-full bg-[#000814] border border-white/10 p-3 rounded-lg text-sm text-white outline-none focus:border-cyan-500/40"
              placeholder="Enter lecture title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-cyan-400 uppercase ml-1">
              Lecture Description
            </label>
            <textarea
              className="w-full bg-[#000814] border border-white/10 p-3 rounded-lg text-sm text-white h-20 resize-none outline-none focus:border-cyan-500/40"
              placeholder="What students will learn?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleSubmit}
            type="button"
            disabled={loading}
            className="w-full bg-cyan-500 text-black font-black py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] transition-transform"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Uploading...
              </>
            ) : (
              "Save Lecture"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LectureModal;