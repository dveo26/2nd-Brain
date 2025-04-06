import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

export interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  text,
  startIcon,
  endIcon,
  onClick,
  type = "button",
  disabled = false,
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        "flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200",
        {
          "bg-gradient-to-r from-indigo-900 to-indigo-800 text-white shadow-md hover:shadow-lg":
            variant === "primary" && !disabled,
          "bg-gradient-to-r from-violet-200 to-indigo-100 text-indigo-900 shadow-sm hover:shadow":
            variant === "secondary" && !disabled,
          "bg-gray-300 text-gray-500 cursor-not-allowed": disabled,
        },
        {
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        }
      )}
    >
      {startIcon && <span className="animate-fadeIn">{startIcon}</span>}
      <span>{text}</span>
      {endIcon && <span className="animate-fadeIn">{endIcon}</span>}
    </motion.button>
  );
};
