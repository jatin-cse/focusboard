import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-medium text-gray-300">{label}</label>
      )}
      <input
        className={`block w-full rounded-lg border bg-gray-900/50 px-3.5 py-2 text-sm text-white placeholder-gray-500 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:pointer-events-none ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-700'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
