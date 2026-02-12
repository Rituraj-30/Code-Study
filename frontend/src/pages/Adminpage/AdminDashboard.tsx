import  { useState } from 'react';
import CategoryManager from './CategoryManager';
import SuccessStudentForm from './SuccessStudentForm';
import NotesUploader from './NotesUploader';
import UserListTable from './UserListTable';
import { FaFolderPlus, FaUserShield, FaBook, FaUserGraduate } from 'react-icons/fa';
import { useSelector } from 'react-redux';
const AdminDashboard = () => {


    const { token } = useSelector((state: any) => state.auth);

    console.log("TOken is here ->",token)
  // 1. State banayi active tab track karne ke liye
  const [activeTab, setActiveTab] = useState("CATEGORIES");

  // 2. Tabs ki configuration
  const tabs = [
    { id: "CATEGORIES", label: "Categories", icon: <FaFolderPlus /> },
    { id: "NOTES", label: "Upload Notes", icon: <FaBook /> },
    { id: "SUCCESS_STORY", label: "Success Stories", icon: <FaUserShield /> },
    { id: "INSTRUCTORS", label: "Instructors", icon: <FaUserShield /> },
    { id: "STUDENTS", label: "Students", icon: <FaUserGraduate /> },
  ];

  return (
    <div className="min-h-screen bg-[#000814] p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black text-white">
                Admin <span className="text-cyan-400">Control Center</span>
            </h1>
            <p className="text-gray-400 mt-2 italic font-mono text-sm">Welcome back, RUTURAJ </p>
        </div>

        {/* 3. Navigation Buttons (Tabs) */}
        <div className="flex flex-wrap gap-3 mb-10 border-b border-white/10 pb-6 justify-center md:justify-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform ${
                activeTab === tab.id
                  ? "bg-cyan-500 text-[#000814] scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. Conditional Rendering (Jo click kiya wahi dikhega) */}
        <div className="transition-all duration-500 ease-in-out">
          
          {activeTab === "CATEGORIES" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-cyan-500 rounded-full"></span> Manage Categories
              </h2>
              <CategoryManager />
            </div>
          )}

          {activeTab === "NOTES" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-yellow-500 rounded-full"></span> Upload New Notes
              </h2>
              <NotesUploader />
            </div>
          )}

          {activeTab === "SUCCESS_STORY" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span> Add Success Student
              </h2>
              <SuccessStudentForm />
            </div>
          )}

          {activeTab === "INSTRUCTORS" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-pink-500 rounded-full"></span> Instructor Management
              </h2>
              <div className="bg-[#161d29] p-4 rounded-2xl border border-white/5">
                <UserListTable type="Instructor" />
              </div>
            </div>
          )}

          {activeTab === "STUDENTS" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-500 rounded-full"></span> Student Management
              </h2>
              <div className="bg-[#161d29] p-4 rounded-2xl border border-white/5">
                <UserListTable type="Student" />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;