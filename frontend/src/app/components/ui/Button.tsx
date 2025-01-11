import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'hover:bg-gray-100 text-gray-700',
    link: 'text-blue-600 hover:underline',
};

const buttonSizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof buttonVariants;
    size?: keyof typeof buttonSizes;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
                                                                     children,
                                                                     className,
                                                                     variant = 'primary',
                                                                     size = 'md',
                                                                     isLoading = false,
                                                                     leftIcon,
                                                                     rightIcon,
                                                                     fullWidth = false,
                                                                     disabled,
                                                                     ...props
                                                                 }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                'relative inline-flex items-center justify-center rounded-lg font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                buttonVariants[variant],
                buttonSizes[size],
                fullWidth ? 'w-full' : '',
                className
            )}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && (
                <Loader2 className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin" />
            )}
            <span className={cn('flex items-center', isLoading ? 'invisible' : '')}>
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
                {children}
                {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </span>
        </button>
    );
});

Button.displayName = 'Button';

export default Button;