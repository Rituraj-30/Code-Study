import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Globe, FileText } from "lucide-react";

interface CourseFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  categories: any[];
  mode: "create" | "edit";
}

const CourseForm: React.FC<CourseFormProps> = ({ initialData, onSubmit, isLoading, categories, mode }) => {
  const [step, setStep] = useState(1);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState({
    courseName: "",
    courseDescription: "",
    whatYouWillLearn: "",
    price: "",
    tag: "",
    category: "",
    instructions: "",
  });

  // Jab Edit mode ho, toh purana data load karo
  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        courseName: initialData.courseName || "",
        courseDescription: initialData.courseDescription || "",
        whatYouWillLearn: initialData.whatYouWillLearn || "",
        price: initialData.price || "",
        tag: Array.isArray(initialData.tag) ? JSON.stringify(initialData.tag) : initialData.tag || "",
        category: initialData.category?._id || initialData.category || "",
        instructions: Array.isArray(initialData.instructions) ? JSON.stringify(initialData.instructions) : initialData.instructions || "",
      });
      setPreview(initialData.thumbnail || "");
    }
  }, [initialData, mode]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // MAIN CHANGE: Optimized Submit Logic
  const handleSubmitInternal = () => {
    const data = new FormData();

    if (mode === "edit") {
      // EDIT MODE: Sirf wahi fields bhejo jo initialData se alag hain
      // Lekin backend simplify karne ke liye hum pura data bhej rahe hain 
      // Backend mein $set operator use karne se sirf wahi update hoga jo hum yahan append karenge
      Object.entries(formData).forEach(([key, value]) => {
        // Validation: Empty strings ko avoid karo agar wo required nahi hain
        if (value !== "") {
          data.append(key, value as string);
        }
      });
    } else {
      // CREATE MODE: Pura data bhejo
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value as string);
      });
    }

    if (thumbnail) {
      data.append("thumbnailImage", thumbnail);
    }
    
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-2 text-white">
      <h1 className="text-xl font-bold mb-4">
        <span className="text-cyan-500">{mode === "create" ? "Create New" : "Edit"}</span> Course
      </h1>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs transition-all
                ${step >= s ? "border-cyan-400 text-cyan-400 bg-cyan-400/10" : "border-gray-600 text-gray-500"}`}>
                {step > s ? <CheckCircle2 size={14} /> : s}
              </div>
              <span className="text-[10px] text-gray-500">{s === 1 ? "Info" : s === 2 ? "Media" : "Review"}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-[1px] mx-2 ${step > i + 1 ? "bg-cyan-400" : "bg-gray-700"}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-[#020617]/80 backdrop-blur border border-white/5 rounded-2xl p-6 shadow-2xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
              <Input label="Course Name" name="courseName" value={formData.courseName} onChange={handleChange} placeholder="e.g. MERN Stack Masterclass" />
              <Select label="Category" name="category" value={formData.category} onChange={handleChange} options={categories} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Price (₹)" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="0 for Free" />
                <Input label="Tags" name="tag" value={formData.tag} onChange={handleChange} placeholder="React, Web, Pro" />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <input hidden id="thumb" type="file" accept="image/*" onChange={handleFileChange} />
              <label htmlFor="thumb" className="cursor-pointer block group">
                {preview ? (
                  <div className="relative">
                    <img src={preview} className="h-44 w-full object-cover rounded-xl border border-cyan-400/40 group-hover:border-cyan-400 transition-all" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-xl text-xs">Change Image</div>
                  </div>
                ) : (
                  <div className="h-44 border border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-cyan-400 transition-all">
                    <Upload size={24} />
                    <span className="text-xs mt-2">Upload Course Thumbnail</span>
                  </div>
                )}
              </label>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <Textarea label="Description" name="courseDescription" value={formData.courseDescription} onChange={handleChange} />
              <Textarea label="Benefits" name="whatYouWillLearn" value={formData.whatYouWillLearn} onChange={handleChange} />
              <Textarea label="Requirements" name="instructions" value={formData.instructions} onChange={handleChange} />
             
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex justify-between items-center">
          <button onClick={() => setStep(s => s - 1)} className={`text-xs text-gray-500 hover:text-white flex items-center gap-1 ${step === 1 && "invisible"}`}>
            <ChevronLeft size={14} /> Back
          </button>
          
          <button 
            onClick={step === 3 ? handleSubmitInternal : () => setStep(s => s + 1)} 
            disabled={isLoading}
            className="bg-cyan-500 text-black text-xs font-bold px-8 py-2.5 rounded-xl flex items-center gap-2 hover:bg-cyan-400 active:scale-95 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : (step === 3 ? (mode === "create" ? "Create Course" : "Save Changes") : <div className="flex items-center gap-1">Next <ChevronRight size={14}/></div>)}
          </button>
        </div>
      </div>
    </div>
  );
};

// ... Input, Textarea, Select components wahi rahenge jo pehle the ...
const Input = ({ label, ...props }: any) => (
  <div className="w-full text-left">
    <label className="text-[11px] text-gray-400 mb-1 block ml-1">{label}</label>
    <input {...props} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none transition-all placeholder:text-gray-700" />
  </div>
);

const Textarea = ({ label, ...props }: any) => (
  <div className="w-full text-left">
    <label className="text-[11px] text-gray-400 mb-1 block ml-1">{label}</label>
    <textarea {...props} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none resize-none transition-all" />
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div className="w-full text-left">
    <label className="text-[11px] text-gray-400 mb-1 block ml-1">{label}</label>
    <select {...props} className="w-full bg-[#000814] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none cursor-pointer">
      <option value="" className="text-gray-500">Select Category</option>
      {options?.map((o: any) => (
        <option key={o._id} value={o._id} className="bg-[#000814]">{o.name}</option>
      ))}
    </select>
  </div>
);

export default CourseForm;