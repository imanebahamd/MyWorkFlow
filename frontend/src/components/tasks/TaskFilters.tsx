import React, { useState, useEffect } from 'react';
import { Row, Col, Badge, Form } from 'react-bootstrap';
import { Search, XCircle } from 'react-bootstrap-icons';
import { TaskStatus, type TaskFilterRequest } from '../../types/task.types';
import Button from '../common/Button';
import Input from '../common/Input';

export interface TaskFilterOptions extends TaskFilterRequest {
  viewMode?: 'list' | 'grid' | 'compact';
}

interface TaskFiltersProps {
  onFilterChange: (filters: TaskFilterOptions) => void;
  onClearFilters: () => void;
  initialFilters?: Partial<TaskFilterOptions>;
  showStatusFilter?: boolean;
  showViewToggle?: boolean;
  disabled?: boolean;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  onFilterChange,
  onClearFilters,
  initialFilters = {},
  showStatusFilter = true,
  showViewToggle = false,
  disabled = false,
}) => {
  const [filters, setFilters] = useState<TaskFilterOptions>({
    search: initialFilters.search || '',
    status: initialFilters.status,
    viewMode: initialFilters.viewMode || 'list',
  });

  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchInput }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search]);

  // Notify parent when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleStatusChange = (status: TaskStatus | 'ALL') => {
    setFilters(prev => ({
      ...prev,
      status: status === 'ALL' ? undefined : status,
    }));
  };

  const handleViewModeChange = (mode: 'list' | 'grid' | 'compact') => {
    setFilters(prev => ({
      ...prev,
      viewMode: mode,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: undefined,
      viewMode: 'list',
    });
    setSearchInput('');
    onClearFilters();
  };

  const hasActiveFilters = filters.search || filters.status;

  return (
    <div className="bg-white p-4 rounded-3 border border-light shadow-sm mb-4">
      {/* Main Filters Row */}
      <Row className="g-3 align-items-center">
        {/* Search */}
        <Col xs={12} md={showStatusFilter ? 8 : 12}>
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={handleSearchChange}
            disabled={disabled}
            icon={<Search size={16} className="text-muted" />}
          />
        </Col>

        {/* Status Filter */}
        {showStatusFilter && (
          <Col xs={12} md={4}>
            <Form.Select
              size="sm"
              value={filters.status || 'ALL'}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus | 'ALL')}
              disabled={disabled}
            >
              <option value="ALL">All Status</option>
              {Object.values(TaskStatus).map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </Form.Select>
          </Col>
        )}
      </Row>

      {/* View Mode Toggle - Only if enabled */}
      {showViewToggle && (
        <Row className="mt-3 pt-3 border-top">
          <Col>
            <div className="d-flex gap-2">
              <span className="text-muted small me-2">View:</span>
              {['list', 'grid', 'compact'].map((mode) => (
                <Button
                  key={mode}
                  variant={filters.viewMode === mode ? 'primary' : 'outline-secondary'}
                  size="sm"
                  onClick={() => handleViewModeChange(mode as any)}
                  disabled={disabled}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-top">
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center flex-wrap gap-2">
                <span className="text-muted small">Active:</span>
                {filters.search && (
                  <Badge bg="primary" className="px-3 py-2">
                    <Search size={12} className="me-1" />
                    "{filters.search}"
                  </Badge>
                )}
                {filters.status && (
                  <Badge bg="secondary" className="px-3 py-2">
                    Status: {filters.status.replace('_', ' ')}
                  </Badge>
                )}
              </div>
            </Col>
            <Col xs="auto">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleClearFilters}
                disabled={disabled}
              >
                <XCircle size={14} className="me-1" />
                Clear All
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;