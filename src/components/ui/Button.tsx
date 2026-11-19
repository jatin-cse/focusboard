import { type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-indigo-600 text-white shadow hover:bg-indigo-500 focus:ring-indigo-500',
  destructive: 'bg-red-500 text-white shadow hover:bg-red-600 focus:ring-red-500',
  outline: 'border border-gray-700 bg-transparent text-gray-200 hover:bg-gray-800 hover:text-white focus:ring-gray-600',
  secondary: 'bg-gray-800 text-gray-200 shadow hover:bg-gray-700 hover:text-white focus:ring-gray-700',
  ghost: 'bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white focus:ring-transparent',
  link: 'bg-transparent text-indigo-400 underline-offset-4 hover:underline focus:ring-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2 text-sm',
  sm: 'h-9 rounded-md px-3 text-xs',
  lg: 'h-11 rounded-md px-8 text-base',
  icon: 'h-10 w-10 p-0',
};

export default function Button({
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
