import React from "react";
import clsx from "clsx";


export interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  text,
  startIcon,
  endIcon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center justify-center gap-2 font-semibold rounded-md transition duration-200 hover-scale-105",
        {
          "bg-indigo-950 text-white hover:bg-indigo-800 transition-transform":
            variant === "primary",
          "bg-violet-200 text-indigo-950 hover:bg-violet-300 transition-transform ":
            variant === "secondary",
        },
        {
          "px-3 py-1 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-5 py-3 text-lg": size === "lg",
        }
      )}
    >
      {startIcon && <span>{startIcon}</span>}
      {text}
      {endIcon && <span>{endIcon}</span>}
    </button>
  );
};
