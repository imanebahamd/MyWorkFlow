import React from 'react';
import { Card } from 'react-bootstrap';
import { 
  Folder,
  Search,
  PlusCircle 
} from 'react-bootstrap-icons';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: 'folder' | 'search' | 'plus';
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = 'folder',
  actionText,
  onAction,
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'search':
        return <Search size={48} className="text-muted" />;
      case 'plus':
        return <PlusCircle size={48} className="text-muted" />;
      case 'folder':
      default:
        return <Folder size={48} className="text-muted" />;
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="text-center py-5">
        <div className="mb-4">
          {getIcon()}
        </div>
        <h4 className="mb-2">{title}</h4>
        <p className="text-muted mb-4">{message}</p>
        {actionText && onAction && (
          <Button onClick={onAction} variant="primary">
            {actionText}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default EmptyState;