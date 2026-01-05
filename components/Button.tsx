
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-2.5 rounded-full font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm";
  
  const variants = {
    primary: "bg-[#c0563b] hover:bg-[#a64932] text-white shadow-sm",
    secondary: "bg-[#e5e4e0] hover:bg-[#d8d7d2] text-[#161616]",
    dark: "bg-[#161616] hover:bg-[#2a2a2a] text-white",
    outline: "border-2 border-[#161616] text-[#161616] hover:bg-[#161616]/5",
    ghost: "text-[#555] hover:text-[#161616] hover:bg-black/5"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="iconify animate-spin" data-icon="solar:restart-bold-duotone"></span>
      ) : children}
    </button>
  );
};
