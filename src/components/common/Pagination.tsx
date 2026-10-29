import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PaginationProps {
  // zero based page index
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// renders nothing when there is only one page
export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-2">
      <Button variant="secondary" size="icon" aria-label="Previous page" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft />
      </Button>
      <span className="px-2 text-sm text-ink-secondary">Page {page + 1} of {totalPages}</span>
      <Button variant="secondary" size="icon" aria-label="Next page" disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>
        <ChevronRight />
      </Button>
    </nav>
  );
}
