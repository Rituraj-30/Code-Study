import { useState } from "react";
// Sahi component import karo jo humne pehle banaya tha
import LectureModal from "./LectureModal"; 

const SectionCard = ({ section }: any) => {
  const [openModal, setOpenModal] = useState(false);

  // onSave handle karne ke liye function
  const handleSave = async (data: any) => {
    console.log("Lecture Data:", data);
    setOpenModal(false);
  };

  return (
    <div className="bg-richblack-700 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-white">{section.sectionName}</h3>
      </div>

      {/* Lectures List */}
      <div className="ml-4 mt-3 space-y-2">
        {section.subSection?.map((lec: any) => (
          <p key={lec._id} className="text-sm text-richblack-200">
            ▶ {lec.title}
          </p>
        ))}
      </div>

      <button
        onClick={() => setOpenModal(true)}
        className="text-yellow-400 mt-3 hover:text-yellow-300 transition-colors"
      >
        + Add Lecture
      </button>

      {/* Modal ko uncomment kiya aur sahi props pass kiye */}
      {openModal && (
        <LectureModal
          onClose={() => setOpenModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default SectionCard;