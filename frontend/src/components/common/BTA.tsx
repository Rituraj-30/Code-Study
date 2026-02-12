import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: React.ReactNode;
  linkto?: string;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  children,
  linkto = "#",
  variant = "primary",
}) => {
  return (
    <Link to={linkto}>
      <div
        className={`
          inline-flex items-center justify-center
          px-6 py-3 rounded-lg
          text-sm font-semibold
          transition-all duration-200
          hover:scale-95

          ${
            variant === "primary"
              ? "bg-linear-to-r from-sky-500 via-cyan-400 to-emerald-300 text-slate-900 shadow-lg hover:shadow-xl"
              : "bg-slate-800 text-white border border-slate-700 shadow-md hover:bg-slate-900"
          }
        `}
      >
        {children}
      </div>
    </Link>
  );
};

export default Button;
