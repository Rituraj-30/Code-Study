import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiChevronLeft, FiLock, FiTrash2 } from "react-icons/fi"; 
import { updateDisplayPicture, updateProfile, deleteProfile } from "../../../services/operations/SetingsAPI";
import ConfirmationModal from "../../common/ConfirmationModal"; 

const Settings = () => {
  const { user } = useSelector((state: any) => state.profile);
  const { token } = useSelector((state: any) => state.auth);
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // ✅ Modal state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewSource, setPreviewSource] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
    gender: user?.additionalDetails?.gender || "",
    contactNumber: user?.additionalDetails?.contactNumber || "",
    about: user?.additionalDetails?.about || "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setPreviewSource(reader.result as string);
    }
  };

  const handleFileUpload = async () => {
    try {
      if (!imageFile) return;
      setLoading(true);
      const formDataObj = new FormData();
      formDataObj.append("profileImage", imageFile);
      await dispatch(updateDisplayPicture(token, formDataObj));
      setLoading(false);
      setImageFile(null);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile(token, formData, navigate));
  };

  // ✅ Account Delete Handler
  const handleDeleteAccount = () => {
    dispatch(deleteProfile(token));
  };

  if (!user) return <div className="flex h-[50vh] items-center justify-center text-white">Loading...</div>;

  return (
    <div className="mx-auto w-full max-w-[1000px] space-y-6 px-6 pb-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* ✅ Confirmation Modal */}
      <ConfirmationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account Permanently?"
        message="Bhai, kya aap sach mein account delete karna chahte hain? Isse aapke saare courses, profile details aur videos hamesha ke liye ud jayenge. Ye action wapas nahi liya ja sakta!"
      />

      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
            <FiChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white md:text-2xl">Settings</h1>
      </div>

      {/* Profile Picture Section */}
      <div className="flex items-center gap-6 rounded-2xl border border-white/5 bg-[#001428] p-6 shadow-sm">
        <img
          src={previewSource || user?.image}
          alt="profile"
          className="h-16 w-16 rounded-full object-cover border border-white/10"
        />
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-gray-300">Change Profile Picture</p>
          <div className="flex gap-3">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-[#161d29] px-4 py-2 text-xs font-bold text-gray-200 border border-white/5 hover:bg-[#20293a] transition-all"
            >
              Select
            </button>
            <button
              onClick={handleFileUpload}
              disabled={!imageFile || loading}
              className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-[#000814] disabled:bg-gray-600 transition-all active:scale-95"
            >
              {loading ? "Uploading..." : <><FiUpload /> Upload</>}
            </button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleFormSubmit} className="rounded-2xl border border-white/5 bg-[#001428] p-6 md:p-8">
        <h3 className="mb-8 text-[10px] font-black uppercase tracking-widest text-cyan-400">Profile Information</h3>
        {/* ... (First Name, Last Name, etc. same as your code) ... */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleOnChange} className="w-full rounded-lg bg-[#000814] border border-white/5 p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleOnChange} className="w-full rounded-lg bg-[#000814] border border-white/5 p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleOnChange} className="w-full rounded-lg bg-[#000814] border border-white/5 p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleOnChange} className="w-full rounded-lg bg-[#000814] border border-white/5 p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase">Contact Number</label>
                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleOnChange} className="w-full rounded-lg bg-[#000814] border border-white/5 p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase">About</label>
                <textarea name="about" rows={4} value={formData.about} onChange={handleOnChange} className="w-full rounded-lg bg-[#000814] border border-white/5 p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none" />
            </div>
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <button type="button" onClick={() => navigate("/dashboard/my-profile")} className="rounded-lg bg-[#161d29] px-6 py-2.5 text-xs font-bold text-gray-400 border border-white/5 hover:text-white transition-all">Cancel</button>
          <button type="submit" className="rounded-lg bg-cyan-500 px-8 py-2.5 text-xs font-bold text-[#000814] hover:bg-cyan-400 transition-all active:scale-95 shadow-lg shadow-cyan-500/10">Save All Changes</button>
        </div>
      </form>

      {/* Security Section */}
      <div className="rounded-2xl border border-white/5 bg-[#001428] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl">
            <FiLock className="text-cyan-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Security</h3>
            <p className="text-xs text-gray-400 mt-1">Change your password to keep your account safe.</p>
          </div>
        </div>
        <button onClick={() => navigate("/dashboard/settings/update-password")} className="w-full md:w-auto rounded-lg bg-[#161d29] border border-white/10 px-6 py-3 text-xs font-bold text-white hover:bg-[#20293a] transition-all">Update Password</button>
      </div>

      {/* ✅ DANGEROUS ZONE: Delete Account Section */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl">
            <FiTrash2 className="text-red-500" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Delete Account</h3>
            <p className="text-xs text-gray-400 mt-1">Would you like to delete account? This account contains Paid Courses. Deleting your account is permanent and will remove all content associated with it.</p>
          </div>
        </div>
        
        <button
          onClick={() => setModalOpen(true)} // ✅ Modal kholo
          className="w-full md:w-auto flex items-center justify-center gap-2 rounded-lg bg-red-600/10 border border-red-600/20 px-6 py-3 text-xs font-bold text-red-500 hover:bg-red-600 hover:text-white transition-all"
        >
          I want to delete my account
        </button>
      </div>

    </div>
  );
};

export default Settings;