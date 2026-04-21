import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed',
          {
            'bg-gradient-to-r from-yellow-500 to-amber-700 text-zinc-950 hover:from-yellow-400 hover:to-amber-600 focus:ring-yellow-500 shadow-lg shadow-amber-900/30':
              variant === 'primary',
            'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 focus:ring-zinc-600 border border-zinc-700':
              variant === 'ghost',
            'bg-red-900/60 text-red-300 hover:bg-red-800/70 focus:ring-red-700 border border-red-800':
              variant === 'danger',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-5 py-2.5 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
