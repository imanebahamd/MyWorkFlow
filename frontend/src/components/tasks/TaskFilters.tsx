import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button as BootstrapButton } from 'react-bootstrap';
import { Search, Filter } from 'react-bootstrap-icons';
import { TaskStatus, type TaskFilterRequest } from '../../types/task.types';
import Button from '../common/Button';

export interface TaskFilterOptions extends TaskFilterRequest {
  viewMode?: 'list' | 'grid' | 'compact';
}

interface TaskFiltersProps {
  onFilterChange: (filters: TaskFilterOptions) => void;
  onClearFilters: () => void;
  initialFilters?: Partial<TaskFilterOptions>;
  showStatusFilter?: boolean;
  showDateFilter?: boolean;
  showViewToggle?: boolean;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  onFilterChange,
  onClearFilters,
  initialFilters = {},
  showStatusFilter = true,
  showDateFilter = true,
  showViewToggle = true,
}) => {
  const [filters, setFilters] = useState<TaskFilterOptions>({
    search: initialFilters.search || '',
    status: initialFilters.status,
    dueDate: initialFilters.dueDate,
    overdue: initialFilters.overdue,
    viewMode: initialFilters.viewMode || 'list',
    sortBy: initialFilters.sortBy || 'dueDate',
    sortDirection: initialFilters.sortDirection || 'asc',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
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

  const handleDateChange = (date?: string) => {
    setFilters(prev => ({
      ...prev,
      dueDate: date || undefined,
    }));
  };

  const handleOverdueToggle = () => {
    setFilters(prev => ({
      ...prev,
      overdue: !prev.overdue,
    }));
  };

  const handleViewModeChange = (mode: 'list' | 'grid' | 'compact') => {
    setFilters(prev => ({
      ...prev,
      viewMode: mode,
    }));
  };

  const handleSortChange = (field: TaskFilterOptions['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortDirection: 
        prev.sortBy === field && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: undefined,
      dueDate: undefined,
      overdue: false,
      viewMode: 'list',
      sortBy: 'dueDate',
      sortDirection: 'asc',
    });
    setSearchInput('');
    setShowAdvanced(false);
    onClearFilters();
  };

  const hasActiveFilters = filters.search || filters.status || filters.dueDate || filters.overdue;

  return (
    <div className="bg-white p-3 rounded shadow-sm mb-4">
      <Row className="align-items-center">
        {/* Search Input */}
        <Col md={showViewToggle ? 5 : 6} className="mb-3 mb-md-0">
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="Search tasks..."
              value={searchInput}
              onChange={handleSearchChange}
              className="ps-4"
            />
            <Search 
              size={18} 
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            />
          </div>
        </Col>

        {/* Quick Filters */}
        <Col md={showViewToggle ? 4 : 5} className="mb-3 mb-md-0">
          <div className="d-flex gap-2">
            {showStatusFilter && (
              <Form.Select
                size="sm"
                value={filters.status || 'ALL'}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus | 'ALL')}
                style={{ width: 'auto' }}
              >
                <option value="ALL">All Status</option>
                {Object.values(TaskStatus).map(status => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </Form.Select>
            )}
            
            {showDateFilter && (
              <Form.Control
                type="date"
                size="sm"
                value={filters.dueDate || ''}
                onChange={(e) => handleDateChange(e.target.value)}
                style={{ width: 'auto' }}
              />
            )}
          </div>
        </Col>

        {/* View Toggle & Actions */}
        <Col md={3} className="text-md-end">
          <div className="d-flex gap-2 justify-content-end">
            {showViewToggle && (
              <div className="btn-group" role="group">
                {['list', 'grid', 'compact'].map((mode) => (
                  <BootstrapButton
                    key={mode}
                    variant={filters.viewMode === mode ? 'primary' : 'outline-secondary'}
                    size="sm"
                    onClick={() => handleViewModeChange(mode as any)}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </BootstrapButton>
                ))}
              </div>
            )}
            
            <Button
              variant={showAdvanced ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter size={14} className="me-1" />
              More
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleClearFilters}
              >
                Clear
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-3 pt-3 border-top">
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small">Sort By</Form.Label>
                <div className="d-flex gap-1">
                  {['title', 'dueDate', 'status', 'createdAt'].map((field) => (
                    <BootstrapButton
                      key={field}
                      variant={filters.sortBy === field ? 'primary' : 'outline-secondary'}
                      size="sm"
                      onClick={() => handleSortChange(field as any)}
                    >
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                      {filters.sortBy === field && (
                        <span className="ms-1">
                          {filters.sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </BootstrapButton>
                  ))}
                </div>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small">Overdue Tasks</Form.Label>
                <div>
                  <Form.Check
                    type="switch"
                    id="overdue-switch"
                    label="Show only overdue tasks"
                    checked={filters.overdue || false}
                    onChange={handleOverdueToggle}
                  />
                </div>
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group>
                <Form.Label className="small">Quick Dates</Form.Label>
                <div className="d-flex gap-1">
                  <BootstrapButton
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleDateChange(new Date().toISOString().split('T')[0])}
                  >
                    Today
                  </BootstrapButton>
                  <BootstrapButton
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      handleDateChange(tomorrow.toISOString().split('T')[0]);
                    }}
                  >
                    Tomorrow
                  </BootstrapButton>
                  <BootstrapButton
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleDateChange(undefined)}
                  >
                    Clear Date
                  </BootstrapButton>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-top">
          <small className="text-muted me-2">Active filters:</small>
          {filters.search && (
            <span className="badge bg-info me-2">
              Search: "{filters.search}"
            </span>
          )}
          {filters.status && (
            <span className="badge bg-secondary me-2">
              Status: {filters.status.replace('_', ' ')}
            </span>
          )}
          {filters.dueDate && (
            <span className="badge bg-secondary me-2">
              Due: {new Date(filters.dueDate).toLocaleDateString()}
            </span>
          )}
          {filters.overdue && (
            <span className="badge bg-danger me-2">
              Overdue only
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;