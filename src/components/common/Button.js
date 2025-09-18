import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  onClick, 
  className = '', 
  type = 'button',
  disabled = false
}) => {
  const baseClasses = 'rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500';
  
  const variants = {
    primary: 'bg-amber-600 text-white hover:bg-amber-700',
    secondary: 'border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white',
    ghost: 'bg-white text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  
  const sizes = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;