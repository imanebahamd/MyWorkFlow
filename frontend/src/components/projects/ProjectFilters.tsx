import React, { useState, useEffect } from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { Search, SortDown, SortUp } from 'react-bootstrap-icons';
import Button from '../common/Button';
import Input from '../common/Input';

export interface FilterOptions {
  search: string;
  sortBy: 'title' | 'createdAt' | 'updatedAt' | 'progressPercentage';
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

  return (
    <div className="bg-white p-3 rounded shadow-sm mb-4">
      <Row className="align-items-center">
        {/* Search Input */}
        <Col md={6} lg={4} className="mb-3 mb-md-0">
          <div className="position-relative">
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchInput}
              onChange={handleSearchChange}
              icon={<Search size={18} />}
            />
          </div>
        </Col>

        {/* Sort Options */}
        {showSortOptions && (
          <Col md={6} lg={4} className="mb-3 mb-md-0">
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Sort by:</span>
              <div className="d-flex gap-1">
                {[
                  { label: 'Date', value: 'createdAt' as const },
                  { label: 'Title', value: 'title' as const },
                  { label: 'Progress', value: 'progressPercentage' as const },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.sortBy === option.value ? 'primary' : 'outline-secondary'}
                    size="sm"
                    onClick={() => handleSortChange(option.value)}
                    className="d-flex align-items-center gap-1"
                  >
                    {option.label}
                    {filters.sortBy === option.value && (
                      filters.sortDirection === 'asc' ? 
                        <SortUp size={14} /> : 
                        <SortDown size={14} />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </Col>
        )}

        {/* Clear Filters */}
        <Col md={12} lg={4} className="text-md-end">
          {hasActiveFilters && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          )}
        </Col>
      </Row>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-top">
          <small className="text-muted me-2">Active filters:</small>
          {filters.search && (
            <Badge bg="info" className="me-2">
              Search: "{filters.search}"
            </Badge>
          )}
          <Badge bg="secondary" className="me-2">
            Sorted by: {filters.sortBy} ({filters.sortDirection})
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;