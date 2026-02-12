import { useState } from "react";
import {
  GripVertical,
  ChevronDown,
  Plus,
  Video,
  PlusCircle,
  Layout,
  Trash2,
  Pencil,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import HighlightText from "../../components/common/HighlightText";
import {
  createSection,
  updateSection,
  deleteSection,
  createSubSection,
  updateSubSection,
  deleteSubSection,
} from "../../services/operations/courseAPI";
import { toast } from "react-hot-toast";

import LectureModal from "../../components/core/Dashboard/LectureModal";

const CourseBuilder = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [sections, setSections] = useState<any[]>([]);
  const [sectionInput, setSectionInput] = useState("");
  const [editSectionId, setEditSectionId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // ================= CREATE / UPDATE SECTION =================
  const handleSectionSubmit = async () => {
    if (!sectionInput.trim() || !courseId) return;

    setLoading(true);
    try {
      let res;
      if (editSectionId) {
        res = await updateSection({
          sectionId: editSectionId,
          sectionName: sectionInput,
          courseId,
        });
        toast.success("Section updated");
      } else {
        res = await createSection({
          sectionName: sectionInput,
          courseId,
        });
        toast.success("Section added");
      }

      setSections(res.data.courseContent);
      setSectionInput("");
      setEditSectionId(null);
    } catch {
      toast.error("Section action failed");
    }
    setLoading(false);
  };

  // ================= DELETE SECTION =================
  const handleDeleteSection = async (sectionId: string) => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await deleteSection({ sectionId, courseId });
      setSections(res.data.courseContent);
      toast.success("Section deleted");
    } catch {
      toast.error("Delete failed");
    }
    setLoading(false);
  };

  // ================= CREATE / UPDATE LECTURE =================
  const handleSaveLecture = async (data: any) => {
    if (!activeSectionId || !courseId) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.desc);
      formData.append("video", data.video);
      formData.append("sectionId", activeSectionId);
      formData.append("courseId", courseId);

      const res = data.subSectionId
        ? await updateSubSection(formData)
        : await createSubSection(formData);

      setSections(res.data.courseContent);
      toast.success("Lecture saved");
      setShowModal(false);
    } catch {
      toast.error("Lecture failed");
    }
    setLoading(false);
  };

  const handleDeleteLecture = async (
    sectionId: string,
    subSectionId: string,
  ) => {
    if (!courseId) return;

    setLoading(true);
    try {
      const res = await deleteSubSection({
        sectionId,
        subSectionId,
        courseId,
      });

      // CHECK: Agar response sahi hai tabhi state update karo
      if (res?.data?.courseContent) {
        setSections(res.data.courseContent);
        toast.success("Lecture deleted");
      } else {
        // Agar backend se poora data nahi aa raha, toh manual filter lagao (Temporary Fix)
        setSections((prev) =>
          prev.map((section) =>
            section._id === sectionId
              ? {
                  ...section,
                  subSection: section.subSection.filter(
                    (s: any) => s._id !== subSectionId,
                  ),
                }
              : section,
          ),
        );
        toast.success("Lecture removed from view");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // Validation logic for Next Step
  const goToNext = () => {
    if (sections.length === 0) {
      toast.error("Please add at least one section");
      return;
    }

    // Check if every section has at least one sub-section
    const allSectionsHaveLectures = sections.every(
      (section) => section.subSection && section.subSection.length > 0,
    );

    if (!allSectionsHaveLectures) {
      toast.error("Each section must have at least one lecture");
      return;
    }

    // If everything is fine
    toast.success("Course structure completed!");
    navigate(`/dashboard/my-courses`); // Ya jo bhi aapka next route ho
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* HEADER */}
      <h2 className="text-xl md:text-2xl font-black text-white flex gap-2 items-center mb-6">
        <Layout className="text-cyan-400" size={22} />
        Course <HighlightText text="Builder" />
      </h2>

      {/* ADD SECTION */}
      <div className="bg-[#001529]/40 border border-white/10 rounded-xl p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            className="flex-1 bg-[#000814] border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
            placeholder="Enter section name..."
            value={sectionInput}
            onChange={(e) => setSectionInput(e.target.value)}
          />
          <button
            onClick={handleSectionSubmit}
            disabled={loading}
            className="bg-cyan-500 text-black px-5 py-2 rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : editSectionId ? (
              "Update"
            ) : (
              "Add"
            )}
            <PlusCircle size={16} />
          </button>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={section._id}
            className="bg-[#000d1f] rounded-xl border border-white/5 overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 bg-white/5">
              <div className="flex items-center gap-3 min-w-0">
                <GripVertical size={18} />
                <div className="bg-[#003566] text-cyan-400 w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold">
                  {index + 1}
                </div>
                <h3 className="text-sm font-bold text-white truncate">
                  {section.sectionName}
                </h3>
              </div>

              <div className="flex gap-3">
                <Pencil
                  size={16}
                  className="cursor-pointer text-gray-400 hover:text-cyan-400"
                  onClick={() => {
                    setEditSectionId(section._id);
                    setSectionInput(section.sectionName);
                  }}
                />
                <Trash2
                  size={16}
                  className="cursor-pointer text-gray-400 hover:text-red-500"
                  onClick={() => handleDeleteSection(section._id)}
                />
                <ChevronDown size={18} />
              </div>
            </div>

            <div className="p-3 bg-black/20">
              {section.subSection?.map((lec: any) => (
                <div
                  key={lec._id}
                  className="flex items-center justify-between pl-8 py-2 text-xs text-gray-400 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Video size={14} className="text-cyan-500" />
                    <span className="truncate">{lec.title}</span>
                  </div>

                  <Trash2
                    size={14}
                    className="cursor-pointer hover:text-red-500 transition-all"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Isse page crash/refresh nahi hoga
                      handleDeleteLecture(section._id, lec._id);
                    }}
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  setActiveSectionId(section._id);
                  setShowModal(true);
                }}
                className="mt-3 ml-8 text-cyan-500 flex items-center gap-1 text-[10px] font-bold uppercase"
              >
                <Plus size={14} /> Add Lecture
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      {/* FOOTER */}
      <div className="mt-10 flex justify-end gap-4 border-t border-white/5 pt-6">
        <button
          className="text-gray-500 font-bold"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <button
          onClick={goToNext} // <--- Call the validation function here
          className="bg-white text-black px-6 py-2 rounded-lg font-black hover:bg-cyan-400 transition-all active:scale-95"
        >
          Next Step
        </button>
      </div>

      {showModal && (
        <LectureModal
          // courseId={courseId!}
          onClose={() => setShowModal(false)}
          onSave={handleSaveLecture}
        />
      )}
    </div>
  );
};

export default CourseBuilder;
