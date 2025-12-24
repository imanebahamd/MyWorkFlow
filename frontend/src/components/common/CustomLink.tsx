import { Link, type LinkProps } from 'react-router-dom';
import React from 'react';

interface CustomLinkProps extends LinkProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const CustomLink = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseClasses = 'transition-all duration-200 ease-in-out font-medium rounded-lg inline-flex items-center justify-center';
    
    const variantClasses = {
      primary: 'text-white bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-hover)] hover:from-[var(--primary-hover)] hover:to-[var(--primary-color)] shadow-sm hover:shadow-md',
      secondary: 'text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--primary-color)] hover:text-[var(--primary-color)]',
      ghost: 'text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-hover)]'
    };
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    return (
      <Link
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      />
    );
  }
);

CustomLink.displayName = 'CustomLink';

export default CustomLink;