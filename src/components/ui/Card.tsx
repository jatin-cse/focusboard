import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  className?: string;
}

export default function Card({ className = '', hoverable = false, children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm shadow-lg transition-all duration-200 ${
        hoverable ? 'hover:border-gray-700 hover:shadow-xl hover:bg-gray-900/80' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center justify-between p-5 border-b border-gray-800/80 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-base font-semibold text-white tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}
