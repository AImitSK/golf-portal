import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline";
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  variant = "default",
                                                  size = "md",
                                                  className = "",
                                                  ...props
                                              }) => {
    const baseStyle = "px-4 py-2 font-medium rounded";
    const variantStyle =
        variant === "outline" ? "border border-gray-500 text-gray-700" : "bg-blue-500 text-white";
    const sizeStyle =
        size === "sm" ? "text-sm" : size === "lg" ? "text-lg px-6 py-3" : "text-md";

    return (
        <button
            className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
