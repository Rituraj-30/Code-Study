import { useState } from "react";
import AddLectureModal from "./AddLectureModal";

const SectionCard = ({ section, courseId }: any) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="bg-richblack-700 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{section.sectionName}</h3>
      </div>

      {/* Lectures */}
      <div className="ml-4 mt-3 space-y-2">
        {section.subSection.map((lec: any) => (
          <p key={lec._id} className="text-sm text-richblack-200">
            ▶ {lec.title}
          </p>
        ))}
      </div>

      <button
        onClick={() => setOpenModal(true)}
        className="text-yellow-400 mt-3"
      >
        + Add Lecture
      </button>

      {openModal && (
        <AddLectureModal
          sectionId={section._id}
          close={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default SectionCard;
