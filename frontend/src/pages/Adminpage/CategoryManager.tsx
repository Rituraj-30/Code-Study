import React, { useState } from "react";
import { toast } from "react-hot-toast";
// Naya mutation hook import karo
import { useCreateCategoryMutation } from "../../services/adminApi";

const CategoryManager = () => {
  const [formData, setFormData] = useState({ name: "", description: "" });

  // RTK Mutation hook initialize karo
  // isLoading se hum button ko disable karenge jab tak request chal rahi hai
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation (optional but good)
    if (!formData.name || !formData.description) {
      toast.error("Please fill all fields");
      return;
    }

    const toastId = toast.loading("Creating category...");
    try {
      // unwrap() use karne se hum direct response handle kar sakte hain
      const response = await createCategory(formData).unwrap();

      if (response.success) {
        toast.success("Category Created Successfully!");
        setFormData({ name: "", description: "" });
      }
    } catch (error: any) {
      console.error("Mutation Error:", error);
      toast.error(error?.data?.message || "Failed to create category");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="bg-[#161d29] p-6 rounded-xl border border-white/10">
      <h2 className="text-white text-xl font-bold mb-4">Create New Category</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="bg-[#000814] text-white p-3 rounded-lg border border-gray-700 outline-none focus:border-yellow-50 disabled:opacity-50"
          placeholder="Category Name"
          disabled={isLoading}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <textarea
          className="bg-[#000814] text-white p-3 rounded-lg border border-gray-700 outline-none focus:border-yellow-50 disabled:opacity-50"
          placeholder="Description"
          rows={3}
          disabled={isLoading}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className={`bg-yellow-50 text-black font-bold py-2 rounded-lg transition-all ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-95 active:scale-90"
          }`}
        >
          {isLoading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default CategoryManager;