import React from 'react';
import { ProgressBar as BootstrapProgressBar } from 'react-bootstrap';

interface CustomProgressBarProps {
  progress: number;
  showLabel?: boolean;
  height?: number;
  className?: string;
}

const ProgressBar: React.FC<CustomProgressBarProps> = ({
  progress,
  showLabel = true,
  height = 8,
  className = '',
}) => {
  const getVariant = (value: number) => {
    if (value === 0) return 'secondary';
    if (value < 30) return 'danger';
    if (value < 50) return 'warning';
    if (value < 80) return 'info';
    if (value < 100) return 'primary';
    return 'success';
  };

  const getLabel = (value: number) => {
    if (value === 0) return 'Not started';
    if (value < 30) return 'Low progress';
    if (value < 50) return 'Moderate progress';
    if (value < 80) return 'Good progress';
    if (value < 100) return 'Almost done';
    return 'Completed';
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="small fw-medium">{getLabel(progress)}</span>
          <span className="small fw-bold">{progress}%</span>
        </div>
      )}
      <BootstrapProgressBar
        now={progress}
        variant={getVariant(progress)}
        style={{ height: `${height}px` }}
        className="rounded-pill"
      />
      {showLabel && progress > 0 && progress < 100 && (
        <div className="text-end mt-1">
          <small className="text-muted">
            {100 - progress}% remaining
          </small>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;