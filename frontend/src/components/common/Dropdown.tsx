import React from 'react';
import { Dropdown as BootstrapDropdown } from 'react-bootstrap';
import { ChevronDown } from 'react-bootstrap-icons';

interface DropdownProps {
  children: React.ReactNode;
  align?: 'start' | 'end';
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

interface DropdownToggleProps {
  children: React.ReactNode;
  variant?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showChevron?: boolean;
  [key: string]: any;
}

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
  width?: 'auto' | 'sm' | 'md' | 'lg';
}

const Dropdown: React.FC<DropdownProps> & {
  Toggle: React.FC<DropdownToggleProps>;
  Menu: React.FC<DropdownMenuProps>;
  Item: typeof BootstrapDropdown.Item;
  Divider: typeof BootstrapDropdown.Divider;
} = ({ children, align = 'start', className = '', variant = 'primary' }) => {
  const variantClasses = {
    primary: 'modern-dropdown-primary',
    secondary: 'modern-dropdown-secondary',
    ghost: 'modern-dropdown-ghost'
  };

  return (
    <BootstrapDropdown 
      align={align} 
      className={`${variantClasses[variant]} ${className}`}
    >
      {children}
    </BootstrapDropdown>
  );
};

const DropdownToggle: React.FC<DropdownToggleProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  showChevron = true,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg'
  };

  return (
    <BootstrapDropdown.Toggle
      variant={variant}
      className={`modern-dropdown-toggle ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <span className="flex items-center gap-2">
        {children}
        {showChevron && <ChevronDown size={16} className="transition-transform" />}
      </span>
    </BootstrapDropdown.Toggle>
  );
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  children, 
  className = '',
  width = 'auto'
}) => {
  const widthClasses = {
    auto: 'min-w-[200px]',
    sm: 'min-w-[240px]',
    md: 'min-w-[320px]',
    lg: 'min-w-[400px]'
  };

  return (
    <BootstrapDropdown.Menu className={`modern-dropdown-menu ${widthClasses[width]} ${className}`}>
      {children}
    </BootstrapDropdown.Menu>
  );
};

Dropdown.Toggle = DropdownToggle;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = BootstrapDropdown.Item;
Dropdown.Divider = BootstrapDropdown.Divider;

export default Dropdown;