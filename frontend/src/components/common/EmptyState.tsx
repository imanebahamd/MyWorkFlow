import React from 'react';
import { Card } from 'react-bootstrap';
import { 
  Folder,
  Search,
  PlusCircle,
  Database,
  FileEarmark
} from 'react-bootstrap-icons';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: 'folder' | 'search' | 'plus' | 'database' | 'file';
  actionText?: string;
  onAction?: () => void;
  variant?: 'default' | 'compact' | 'illustrated';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = 'folder',
  actionText,
  onAction,
  variant = 'default'
}) => {
  const getIcon = () => {
    const iconProps = {
      size: variant === 'compact' ? 32 : 64,
      className: "text-[var(--primary-color)]"
    };

    switch (icon) {
      case 'search':
        return <Search {...iconProps} />;
      case 'plus':
        return <PlusCircle {...iconProps} />;
      case 'database':
        return <Database {...iconProps} />;
      case 'file':
        return <FileEarmark {...iconProps} />;
      case 'folder':
      default:
        return <Folder {...iconProps} />;
    }
  };

  const getIllustration = () => {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-light)]/20 to-[var(--secondary-color)]/20 blur-2xl rounded-full" />
        <div className="relative">
          {getIcon()}
        </div>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className="text-center p-6 bg-gradient-to-br from-[var(--bg-tertiary)]/50 to-white rounded-xl border border-[var(--border-primary)]">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm border border-[var(--border-primary)] mb-4">
          {getIcon()}
        </div>
        <h5 className="font-semibold text-[var(--text-primary)] mb-2">{title}</h5>
        <p className="text-[var(--text-secondary)] text-sm mb-4">{message}</p>
        {actionText && onAction && (
          <Button 
            onClick={onAction} 
            variant="primary"
            size="sm"
            className="shadow-sm"
          >
            {actionText}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-lg modern-card-hover bg-gradient-to-br from-white to-[var(--bg-tertiary)]/30">
      <Card.Body className="text-center py-8 px-6">
        <div className="mb-6">
          {variant === 'illustrated' ? getIllustration() : (
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[var(--primary-light)]/20 to-[var(--secondary-color)]/20 rounded-full mb-4">
              {getIcon()}
            </div>
          )}
        </div>
        <h4 className="font-bold text-xl text-[var(--text-primary)] mb-3">{title}</h4>
        <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">{message}</p>
        {actionText && onAction && (
          <Button 
            onClick={onAction} 
            variant="primary"
            className="shadow-md hover:shadow-lg transition-shadow"
          >
            {actionText}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default EmptyState;