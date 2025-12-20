import React from 'react';
import { Dropdown as BootstrapDropdown } from 'react-bootstrap';

interface DropdownProps {
  children: React.ReactNode;
  align?: 'start' | 'end';
  className?: string;
}

interface DropdownToggleProps {
  children: React.ReactNode;
  variant?: string;
  size?: 'sm' | 'lg';
  className?: string;
  [key: string]: any;
}

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> & {
  Toggle: React.FC<DropdownToggleProps>;
  Menu: React.FC<DropdownMenuProps>;
  Item: typeof BootstrapDropdown.Item;
  Divider: typeof BootstrapDropdown.Divider;
} = ({ children, align = 'start', className = '' }) => {
  return (
    <BootstrapDropdown align={align} className={className}>
      {children}
    </BootstrapDropdown>
  );
};

const DropdownToggle: React.FC<DropdownToggleProps> = ({ 
  children, 
  variant = 'primary', 
  size, 
  className = '', 
  ...props 
}) => {
  return (
    <BootstrapDropdown.Toggle
      variant={variant}
      size={size}
      className={className}
      {...props}
    >
      {children}
    </BootstrapDropdown.Toggle>
  );
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <BootstrapDropdown.Menu className={`shadow ${className}`}>
      {children}
    </BootstrapDropdown.Menu>
  );
};

Dropdown.Toggle = DropdownToggle;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = BootstrapDropdown.Item;
Dropdown.Divider = BootstrapDropdown.Divider;

export default Dropdown;