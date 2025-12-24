import React from 'react';
import { Pagination as BootstrapPagination, Form, Row, Col } from 'react-bootstrap';
import { 
  ChevronLeft, 
  ChevronRight,
  ChevronDoubleLeft,
  ChevronDoubleRight,
  List,
  ArrowClockwise,
  ChevronDown
} from 'react-bootstrap-icons';

interface PaginationAdvancedProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onRefresh?: () => void;
  className?: string;
  showPageInfo?: boolean;
  showPageSizeSelector?: boolean;
  showFirstLast?: boolean;
  showRefresh?: boolean;
  compact?: boolean;
  disabled?: boolean;
}

const PaginationAdvanced: React.FC<PaginationAdvancedProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  onRefresh,
  className = '',
  showPageInfo = true,
  showPageSizeSelector = true,
  showFirstLast = true,
  showRefresh = false,
  compact = false,
  disabled = false,
}) => {
  if (totalPages <= 0 || totalItems <= 0) {
    return null;
  }

  const getPageInfo = () => {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    return (
      <span className="d-flex align-items-center gap-1">
        <span className="d-none d-sm-inline">Showing</span>
        <span className="fw-semibold text-primary">{startItem}-{endItem}</span> 
        <span className="d-none d-sm-inline">of</span>
        <span className="fw-semibold">{totalItems}</span>
        <span className="d-none d-md-inline">items</span>
      </span>
    );
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
      onPageChange(1);
    }
  };

  const renderPageNumbers = () => {
    if (compact && totalPages > 5) {
      return (
        <>
          <BootstrapPagination.Item 
            active
            className="modern-pagination-item mx-1"
          >
            {currentPage}
          </BootstrapPagination.Item>
          <BootstrapPagination.Ellipsis disabled />
          <BootstrapPagination.Item 
            onClick={() => onPageChange(totalPages)}
            className="modern-pagination-item mx-1"
          >
            {totalPages}
          </BootstrapPagination.Item>
        </>
      );
    }

    const items = [];
    const maxVisible = compact ? 3 : 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1 && showFirstLast) {
      items.push(
        <BootstrapPagination.Item
          key={1}
          onClick={() => onPageChange(1)}
          className="modern-pagination-item mx-1"
          disabled={disabled}
        >
          1
        </BootstrapPagination.Item>
      );
      if (startPage > 2) {
        items.push(<BootstrapPagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <BootstrapPagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
          disabled={disabled}
          className={`modern-pagination-item mx-1 ${page === currentPage ? 'active' : ''}`}
        >
          {page}
        </BootstrapPagination.Item>
      );
    }

    if (endPage < totalPages && showFirstLast) {
      if (endPage < totalPages - 1) {
        items.push(<BootstrapPagination.Ellipsis key="end-ellipsis" disabled />);
      }
      items.push(
        <BootstrapPagination.Item
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          disabled={disabled}
          className="modern-pagination-item mx-1"
        >
          {totalPages}
        </BootstrapPagination.Item>
      );
    }

    return items;
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className={`glass-effect rounded-3 border-0 shadow-sm p-4 ${className}`}>
      <Row className={`align-items-center ${compact ? 'gap-3' : ''}`}>
        {/* Page Info */}
        {showPageInfo && !compact && (
          <Col xs={12} md={4} className="mb-3 mb-md-0">
            <div className="text-secondary d-flex align-items-center gap-2">
              <div className="w-8 h-8 rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10">
                <i className="bi bi-list-ul text-primary"></i>
              </div>
              <div className="small">{getPageInfo()}</div>
            </div>
          </Col>
        )}

        {/* Compact Info */}
        {compact && (
          <Col xs={12} className="mb-3 text-center">
            <div className="text-secondary small">
              {getPageInfo()}
            </div>
          </Col>
        )}

        {/* Pagination Controls */}
        <Col xs={12} md={compact ? 12 : showPageSizeSelector ? 5 : 8} className={compact ? '' : 'mb-3 mb-md-0'}>
          <BootstrapPagination className={`justify-content-center mb-0 modern-pagination ${compact ? 'justify-center' : ''}`}>
            {/* First Button */}
            {showFirstLast && !compact && (
              <BootstrapPagination.First
                onClick={() => onPageChange(1)}
                disabled={isFirstPage || disabled}
                title="First page"
                className="modern-pagination-nav mx-1"
              >
                <ChevronDoubleLeft size={14} />
              </BootstrapPagination.First>
            )}

            {/* Previous Button */}
            <BootstrapPagination.Prev
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={isFirstPage || disabled}
              title="Previous page"
              className="modern-pagination-nav mx-1"
            >
              <ChevronLeft size={16} />
            </BootstrapPagination.Prev>

            {/* Page Numbers */}
            {renderPageNumbers()}

            {/* Next Button */}
            <BootstrapPagination.Next
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={isLastPage || disabled}
              title="Next page"
              className="modern-pagination-nav mx-1"
            >
              <ChevronRight size={16} />
            </BootstrapPagination.Next>

            {/* Last Button */}
            {showFirstLast && !compact && (
              <BootstrapPagination.Last
                onClick={() => onPageChange(totalPages)}
                disabled={isLastPage || disabled}
                title="Last page"
                className="modern-pagination-nav mx-1"
              >
                <ChevronDoubleRight size={14} />
              </BootstrapPagination.Last>
            )}

            {/* Refresh Button */}
            {showRefresh && onRefresh && (
              <BootstrapPagination.Item
                onClick={onRefresh}
                disabled={disabled}
                title="Refresh"
                className="modern-pagination-nav mx-1"
              >
                <ArrowClockwise size={14} />
              </BootstrapPagination.Item>
            )}
          </BootstrapPagination>
        </Col>

        {/* Page Size Selector */}
        {showPageSizeSelector && onPageSizeChange && !compact && (
          <Col xs={12} md={3} className="text-md-end">
            <div className="d-flex align-items-center justify-content-md-end gap-3">
              <div className="d-flex align-items-center gap-2">
                <List size={16} className="text-secondary" />
                <span className="small text-secondary d-none d-md-inline">Items per page:</span>
              </div>
              <div className="position-relative">
                <Form.Select
                  size="sm"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  disabled={disabled}
                  className="modern-select border-0 shadow-sm px-3 py-2 pe-4"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    appearance: 'none',
                    minWidth: '140px'
                  }}
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option} per page
                    </option>
                  ))}
                </Form.Select>
                <ChevronDown 
                  size={12} 
                  className="position-absolute end-2 top-50 translate-middle-y text-muted"
                  style={{ pointerEvents: 'none' }}
                />
              </div>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default PaginationAdvanced;