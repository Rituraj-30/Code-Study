import { useState } from "react";
import { useCreateSubSectionMutation } from "../../../services/authApi";

const AddLectureModal = ({ sectionId, close }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);

  const [createSubSection] = useCreateSubSectionMutation();

  const handleSave = async () => {
    if (!title || !description || !video) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("sectionId", sectionId);
    formData.append("video", video);

    await createSubSection(formData);
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-richblack-800 p-6 rounded-lg w-[500px]">
        <h2 className="text-lg font-semibold mb-4">Adding Lecture</h2>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
          className="mb-3"
        />

        <input
          className="w-full p-2 mb-3 bg-richblack-700 rounded"
          placeholder="Lecture Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-2 mb-3 bg-richblack-700 rounded"
          placeholder="Lecture Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={close}>Cancel</button>
          <button
            onClick={handleSave}
            className="bg-yellow-400 text-black px-4 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLectureModal;
