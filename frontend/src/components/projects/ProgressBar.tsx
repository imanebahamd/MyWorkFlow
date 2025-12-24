import React from 'react';
import { ProgressBar as BootstrapProgressBar } from 'react-bootstrap';

interface CustomProgressBarProps {
  progress: number;
  showLabel?: boolean;
  height?: number;
  className?: string;
  showRemaining?: boolean;
}

const ProgressBar: React.FC<CustomProgressBarProps> = ({
  progress,
  showLabel = true,
  height = 10,
  className = '',
  showRemaining = true,
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
    if (value < 30) return 'Getting started';
    if (value < 50) return 'Making progress';
    if (value < 80) return 'Good progress';
    if (value < 100) return 'Almost done';
    return 'Completed';
  };

  const variant = getVariant(progress);

  return (
    <div className={className}>
      {showLabel && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="small fw-medium d-flex align-items-center">
            <div 
              className={`rounded-circle me-2 bg-${variant}`}
              style={{ width: '8px', height: '8px' }}
            ></div>
            {getLabel(progress)}
          </span>
          <span className="fw-bold" style={{ color: `var(--${variant}-color)` }}>
            {progress}%
          </span>
        </div>
      )}
      <div className="position-relative">
        <BootstrapProgressBar
          now={progress}
          variant={variant}
          style={{ 
            height: `${height}px`,
            backgroundColor: 'var(--bg-secondary)'
          }}
          className="rounded-pill overflow-hidden"
        />
        {/* Animated shimmer effect */}
        {progress > 0 && progress < 100 && (
          <div 
            className="progress-shimmer"
            style={{
              width: `${progress}%`,
              height: `${height}px`,
              borderRadius: '50px'
            }}
          ></div>
        )}
      </div>
      {showLabel && showRemaining && progress > 0 && progress < 100 && (
        <div className="text-end mt-2">
          <small className="text-muted">
            {100 - progress}% remaining to completion
          </small>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;