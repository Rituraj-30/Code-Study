import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        accountType: "Admin" | "Instructor" | "Student";
      };
      files?: {
        thumbnailImage?: any;
      };
    }
  }
}

export {};
