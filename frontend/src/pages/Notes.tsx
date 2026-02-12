import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import HighlightText from "../components/common/HighlightText";
import { useSelector } from "react-redux"; // Redux hook add kiya
import type{ RootState } from "../redux/store"; 
import { toast } from "react-hot-toast"; 
// import { useNavigate } from "react-router-dom";
import "./NotesPage.css";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface INote {
  _id: string;
  title: string;
  category: string;
  thumbnail: string;
  fileUrl: string;
  language: string;
  description?: string;
}

const NotesPage: React.FC = () => {
  const [sections, setSections] = useState<any>(null);
  const [allNotes, setAllNotes] = useState<INote[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

    // const navigate = useNavigate();
  

  // 1. Redux aur LocalStorage se token check karna
  const token = useSelector((state: RootState) => state.auth.token) || localStorage.getItem("token");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/auth/getAllNotes"
        );
        setSections(data.data);
        setAllNotes(data.allData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // 2. Updated handleDownload with Login Check
  const handleDownload = async (url: string, filename: string) => {
    // Agar token nahi hai toh download block karo
    if (!token) {
      
      toast.error("Please login to download notes!");
      // navigate("/login");
      
      return; 
    }

    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${filename.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const filteredNotes = allNotes.filter((note) =>
    [note.title, note.language, note.category]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-600 font-bold text-xl">
        Preparing Resources...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      
      {/* ===== HEADER + SEARCH ===== */}
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
          CodeStudy <HighlightText text={"Library"} /> 
        </h1>
        <p className="text-slate-500 mb-6">
          Find all your professional coding documents in one place.
        </p>

        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search by topic, language or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 pl-12 focus:ring-4 focus:ring-cyan-100 outline-none shadow-sm"
          />
          <svg
            className="w-5 h-5 text-cyan-500 absolute left-4 top-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* ===== SEARCH RESULT ===== */}
      {searchTerm ? (
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDownload={handleDownload}
              isLoggedIn={!!token} // Pass login status
            />
          ))}
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto space-y-12">
          {sections &&
            Object.entries(sections).map(([key, list]: [string, any]) =>
              list.length ? (
                <section key={key}>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-xl font-black uppercase text-slate-900">
                      {key}
                    </h2>
                    <div className="flex-grow h-[1px] bg-slate-200" />
                  </div>

                  <div className="relative px-4 sm:px-8">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      slidesPerView="auto"
                      spaceBetween={20}
                    
                      pagination={{ clickable: true }}
                      className="pb-10"
                    >
                      {list.map((note: INote) => (
                        <SwiperSlide key={note._id} className="!w-auto">
                          <NoteCard
                            note={note}
                            onDownload={handleDownload}
                            isLoggedIn={!!token}
                          />
                        </SwiperSlide>
                      ))}
                      <br />
                    </Swiper>
                  </div>
                </section>
              ) : null
            )}
        </div>
      )}
    </div>
  );
};

// Sub-component for NoteCard
const NoteCard = ({
  note,
  onDownload,
  isLoggedIn,
}: {
  note: INote;
  onDownload: (url: string, name: string) => void;
  isLoggedIn: boolean;
}) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col h-[260px] w-[260px] hover:shadow-lg transition-all group">
    <div className="flex justify-between mb-3">
      <span className="bg-cyan-50 text-cyan-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
        {note.category}
      </span>
      <span className="text-slate-400 text-[10px] font-bold uppercase">
        {note.language}
      </span>
    </div>

    <div className="flex justify-center mb-3">
      <div className="w-14 h-14 bg-slate-50 rounded-xl p-3 group-hover:scale-110 transition-transform">
        <img
          src={note.thumbnail}
          alt={note.title}
          className="w-full h-full object-contain"
        />
      </div>
    </div>

    <div className="flex-grow text-center">
      <h3 className="font-bold text-sm mb-1 line-clamp-1 text-slate-800">
        {note.title}
      </h3>
      <p className="text-[11px] text-slate-500 italic line-clamp-2">
        {note.description || `High-quality ${note.language} study material.`}
      </p>
    </div>

    <button
      onClick={() => onDownload(note.fileUrl, note.title)}
      className={`mt-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
        isLoggedIn 
          ? "bg-slate-900 text-white hover:bg-cyan-600" 
          : "bg-gray-100 text-gray-400 cursor-pointer"
      }`}
    >
      {isLoggedIn ? "DOWNLOAD PDF" : "LOGIN TO DOWNLOAD"}
    </button>
  </div>
);

export default NotesPage;