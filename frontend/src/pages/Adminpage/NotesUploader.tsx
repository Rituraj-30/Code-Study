import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useUploadNoteMutation } from "../../services/adminApi"; 

const NotesUploader = () => {
  const [uploadNote, { isLoading }] = useUploadNoteMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "", // Ismein "Handbook", "Note", ya "Cheatsheet" jayega
    language: "",
  });

  const [files, setFiles] = useState<{ thumbnail: File | null; pdfFile: File | null }>({
    thumbnail: null,
    pdfFile: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (!files.thumbnail || !files.pdfFile) {
      toast.error("Please select both thumbnail and PDF file");
      return;
    }

    const toastId = toast.loading("Uploading notes...");
    
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category); 
    data.append("language", formData.language);
    data.append("thumbnail", files.thumbnail);
    data.append("pdfFile", files.pdfFile);

    try {
      const res = await uploadNote(data).unwrap();
      if (res.success) {
        toast.success("Notes Published Successfully!");
        setFormData({ title: "", description: "", category: "", language: "" });
        setFiles({ thumbnail: null, pdfFile: null });
        // File inputs ko reset karne ke liye page reload ya ref use kar sakte ho
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Error uploading notes");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="bg-[#161d29] p-6 rounded-xl border border-white/5 mt-8 shadow-2xl">
      <h2 className="text-white text-2xl font-black mb-6 border-b border-white/10 pb-2">
        Upload Study Notes
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" placeholder="Note Title" required
            className="bg-[#000814] text-white p-3 rounded-lg border border-gray-800 outline-none focus:border-cyan-500"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
          
          {/* Static Category Dropdown */}
          <select
            required
            className="bg-[#000814] text-white p-3 rounded-lg border border-gray-800 outline-none focus:border-cyan-500 cursor-pointer"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="" disabled>Select Category</option>
            <option value="Handbook">Handbook</option>
            <option value="Note">Note</option>
            <option value="Cheatsheet">Cheatsheet</option>
          </select>
        </div>
        
        <div className="w-full">
          <input 
            type="text" placeholder="Language (e.g. C++, Java)" required
            className="w-full bg-[#000814] text-white p-3 rounded-lg border border-gray-800 outline-none focus:border-cyan-500"
            value={formData.language}
            onChange={(e) => setFormData({...formData, language: e.target.value})}
          />
        </div>

        <textarea 
          placeholder="Short Description" rows={3}
          className="w-full bg-[#000814] text-white p-3 rounded-lg border border-gray-800 outline-none focus:border-cyan-500"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm">Thumbnail (Image)</label>
            <input 
              type="file" accept="image/*" required
              onChange={(e) => setFiles({...files, thumbnail: e.target.files ? e.target.files[0] : null})} 
              className="text-gray-500 file:bg-[#000814] file:text-white file:border file:border-gray-700 file:rounded-md file:p-1" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-sm">Notes File (PDF)</label>
            <input 
              type="file" accept="application/pdf" required
              onChange={(e) => setFiles({...files, pdfFile: e.target.files ? e.target.files[0] : null})} 
              className="text-gray-500 file:bg-[#000814] file:text-white file:border file:border-gray-700 file:rounded-md file:p-1" 
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 rounded-lg transition-all ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.01] active:scale-95 shadow-lg"
          }`}
        >
          {isLoading ? "Uploading..." : "Publish Notes"}
        </button>
      </form>
    </div>
  );
};

export default NotesUploader;