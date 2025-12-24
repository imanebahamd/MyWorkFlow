import React, { useState, useEffect } from 'react';
import { Row, Col, Badge, Form } from 'react-bootstrap';
import { Search, SortDown, SortUp, XCircle, Calendar, SortAlphaDown, Clock } from 'react-bootstrap-icons';
import Button from '../common/Button';
import Input from '../common/Input';

export interface FilterOptions {
  search: string;
  sortBy: 'title' | 'createdAt' | 'updatedAt';
  sortDirection: 'asc' | 'desc';
}

interface ProjectFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  initialFilters?: Partial<FilterOptions>;
  showSortOptions?: boolean;
  disabled?: boolean;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  onFilterChange,
  onClearFilters,
  initialFilters = {},
  showSortOptions = true,
  disabled = false,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: initialFilters.search || '',
    sortBy: initialFilters.sortBy || 'createdAt',
    sortDirection: initialFilters.sortDirection || 'desc',
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

  const handleSortChange = (field: FilterOptions['sortBy']) => {
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
      sortBy: 'createdAt',
      sortDirection: 'desc',
    });
    setSearchInput('');
    onClearFilters();
  };

  const hasActiveFilters = filters.search || filters.sortBy !== 'createdAt';

  const sortOptions = [
    { 
      label: 'Date Created', 
      value: 'createdAt' as const, 
      icon: <Calendar size={14} /> 
    },
    { 
      label: 'Name', 
      value: 'title' as const, 
      icon: <SortAlphaDown size={14} /> 
    },
    { 
      label: 'Last Modified', 
      value: 'updatedAt' as const, 
      icon: <Clock size={14} /> 
    },
  ];

  return (
    <div className="bg-white p-4 rounded-3 border border-light shadow-sm mb-4">
      {/* Main Filters Row */}
      <Row className="g-3 align-items-center">
        {/* Search - Full width on mobile, 8 columns on desktop */}
        <Col xs={12} md={showSortOptions ? 8 : 12}>
          <Input
            type="text"
            placeholder="Search projects by name or description..."
            value={searchInput}
            onChange={handleSearchChange}
            disabled={disabled}
            icon={<Search size={16} className="text-muted" />}
          />
        </Col>

        {/* Sort Options - Full width on mobile, 4 columns on desktop */}
        {showSortOptions && (
          <Col xs={12} md={4}>
            <div className="d-flex align-items-center">
              <label className="text-muted small me-3 mb-0">Sort:</label>
              <Form.Select
                size="sm"
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
                disabled={disabled}
                className="flex-grow-1"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {filters.sortBy === option.value && `(${filters.sortDirection})`}
                  </option>
                ))}
              </Form.Select>
              <Button
                variant="link"
                size="sm"
                onClick={() => handleSortChange(filters.sortBy)}
                disabled={disabled}
                className="ms-2 p-1"
                title={`Sort ${filters.sortDirection === 'asc' ? 'descending' : 'ascending'}`}
              >
                {filters.sortDirection === 'asc' ? 
                  <SortUp size={18} /> : 
                  <SortDown size={18} />
                }
              </Button>
            </div>
          </Col>
        )}
      </Row>

      {/* Active Filters Row - Only shows when filters are active */}
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
                <Badge bg="secondary" className="px-3 py-2">
                  {sortOptions.find(o => o.value === filters.sortBy)?.icon}
                  <span className="ms-1">
                    {filters.sortBy === 'createdAt' ? 'Date Created' : 
                     filters.sortBy === 'title' ? 'Name' : 'Last Modified'}
                    <small className="ms-1">
                      ({filters.sortDirection})
                    </small>
                  </span>
                </Badge>
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

export default ProjectFilters;