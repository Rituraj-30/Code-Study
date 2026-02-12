import { Request, Response } from "express";
import NoteModels from "../models/NoteModels";

export const GetAllNotes = async (req: Request, res: Response) => {
  try {
   
    const allNotes = await NoteModels.find().sort({ createdAt: -1 });

    if (!allNotes || allNotes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No notes found in the database",
      });
    }

    const categorizedData = {
      handbooks: allNotes.filter((note) => note.category === "Handbook"),
      studyNotes: allNotes.filter((note) => note.category === "Note"),
      cheatsheets: allNotes.filter((note) => note.category === "Cheatsheet"),
    };

    
    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: allNotes.length,
      data: categorizedData, 
      allData: allNotes,     
    });

  } catch (error: any) {
    console.error("GET_ALL_NOTES_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching notes",
      error: error.message,
    });
  }
};


export const downloadNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = await NoteModels.findById(id);

    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    res.status(200).json({
      success: true,
      downloadUrl: note.fileUrl, 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};