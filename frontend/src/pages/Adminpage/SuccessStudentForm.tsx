import React, { useState } from "react";
import { toast } from "react-hot-toast";
// Naya mutation hook import karo
import { useAddSuccessStudentMutation } from "../../services/adminApi";

const SuccessStudentForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState({ fullName: "", company: "", packege: "", role: "" });

  // RTK Mutation hook use karo
  const [addSuccessStudent, { isLoading }] = useAddSuccessStudentMutation();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload student image");
      return;
    }

    const toastId = toast.loading("Adding success story...");
    
    // FormData tayyar karo
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("company", data.company);
    formData.append("packege", data.packege);
    formData.append("role", data.role);
    formData.append("image", file); // Backend me field name 'image' hi rakhna

    try {
      // unwrap() use karne se response direct catch block me fail ho jata hai agar success false ho
      const res = await addSuccessStudent(formData).unwrap();

      if (res.success) {
        toast.success("Student Story Added Successfully!");
        // Form Clear karo
        setData({ fullName: "", company: "", packege: "", role: "" });
        setFile(null);
        // Page refresh ki zaroorat nahi, list auto-update ho jayegi agar tag use kiya hai
      }
    } catch (err: any) {
      console.error("Mutation Error:", err);
      toast.error(err?.data?.message || "Failed to add student story");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="bg-[#161d29] p-6 rounded-xl border border-white/10 mt-8 shadow-xl">
      <h2 className="text-white text-xl font-bold mb-6 text-center border-b border-white/5 pb-4">
        Add Success Story
      </h2>
      <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" placeholder="Full Name" required
          disabled={isLoading}
          value={data.fullName}
          className="bg-[#000814] text-white p-3 rounded-md border border-gray-700 outline-none focus:border-cyan-500 disabled:opacity-50"
          onChange={(e) => setData({...data, fullName: e.target.value})}
        />
        <input 
          type="text" placeholder="Company Name" required
          disabled={isLoading}
          value={data.company}
          className="bg-[#000814] text-white p-3 rounded-md border border-gray-700 outline-none focus:border-cyan-500 disabled:opacity-50"
          onChange={(e) => setData({...data, company: e.target.value})}
        />
        <input 
          type="text" placeholder="Package (e.g. 12 LPA)" required
          disabled={isLoading}
          value={data.packege}
          className="bg-[#000814] text-white p-3 rounded-md border border-gray-700 outline-none focus:border-cyan-500 disabled:opacity-50"
          onChange={(e) => setData({...data, packege: e.target.value})}
        />
         <input 
          type="text" placeholder="Role (e.g. SDE-1)" required
          disabled={isLoading}
          value={data.role}
          className="bg-[#000814] text-white p-3 rounded-md border border-gray-700 outline-none focus:border-cyan-500 disabled:opacity-50"
          onChange={(e) => setData({...data, role: e.target.value})}
        />
        
        <div className="col-span-full flex flex-col gap-2">
          <label className="text-gray-400 text-sm">Student Photo</label>
          <input 
            type="file" accept="image/*" required
            disabled={isLoading}
            className="text-gray-400 file:bg-white/10 file:text-white file:border-none file:px-4 file:py-2 file:rounded-md file:cursor-pointer"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className={`col-span-full font-bold py-3 rounded-lg mt-4 transition-all ${
            isLoading 
            ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
            : "bg-cyan-500 text-white hover:bg-cyan-600 active:scale-95"
          }`}
        >
          {isLoading ? "Posting Story..." : "Post Success Story"}
        </button>
      </form>
    </div>
  );
};

export default SuccessStudentForm;