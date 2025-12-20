import React from 'react';
import { Pagination as BootstrapPagination, Form, Row, Col } from 'react-bootstrap';
import { 
  ChevronLeft, 
  ChevronRight,
  List
} from 'react-bootstrap-icons';

interface PaginationAdvancedProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
  showPageInfo?: boolean;
  showPageSizeSelector?: boolean;
  disabled?: boolean;
}

const PaginationAdvanced: React.FC<PaginationAdvancedProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 25, 50],
  onPageChange,
  onPageSizeChange,
  className = '',
  showPageInfo = true,
  showPageSizeSelector = true,
}) => {
  if (totalPages <= 0 || totalItems <= 0) {
    return null;
  }

  const getPageInfo = () => {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    return `Showing ${startItem}-${endItem} of ${totalItems} items`;
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
      // Reset to first page when changing page size
      onPageChange(1);
    }
  };

  const renderPageNumbers = () => {
    const items = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <BootstrapPagination.Item
          key={1}
          onClick={() => onPageChange(1)}
        >
          1
        </BootstrapPagination.Item>
      );
      if (startPage > 2) {
        items.push(<BootstrapPagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }

    // Middle pages
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <BootstrapPagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </BootstrapPagination.Item>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<BootstrapPagination.Ellipsis key="end-ellipsis" disabled />);
      }
      items.push(
        <BootstrapPagination.Item
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </BootstrapPagination.Item>
      );
    }

    return items;
  };

  return (
    <Row className={`align-items-center ${className}`}>
      {/* Page Info */}
      {showPageInfo && (
        <Col xs={12} md={4} className="mb-3 mb-md-0">
          <div className="text-muted small">
            {getPageInfo()}
          </div>
        </Col>
      )}

      {/* Pagination Controls */}
      <Col xs={12} md={showPageSizeSelector ? 5 : 8} className="mb-3 mb-md-0">
        <BootstrapPagination className="justify-content-center mb-0">
          {/* Previous Button */}
          <BootstrapPagination.Prev
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </BootstrapPagination.Prev>

          {/* Page Numbers */}
          {renderPageNumbers()}

          {/* Next Button */}
          <BootstrapPagination.Next
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            title="Next page"
          >
            <ChevronRight size={16} />
          </BootstrapPagination.Next>
        </BootstrapPagination>
      </Col>

      {/* Page Size Selector */}
      {showPageSizeSelector && onPageSizeChange && (
        <Col xs={12} md={3} className="text-md-end">
          <div className="d-flex align-items-center justify-content-md-end gap-2">
            <List size={16} className="text-muted" />
            <Form.Select
              size="sm"
              style={{ width: 'auto' }}
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </Form.Select>
          </div>
        </Col>
      )}
    </Row>
  );
};

export default PaginationAdvanced;