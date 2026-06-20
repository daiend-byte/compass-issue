import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PER_PAGE } from '../constants';

type PaginationBarProps = Readonly<{
  page: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}>;

const subtleButton = 'h-6 border-transparent bg-line text-xs text-ink hover:bg-line/70';

export function PaginationBar({ page, totalCount, onPageChange }: PaginationBarProps) {
  if (totalCount === 0) return null;

  const pageCount = Math.ceil(totalCount / PER_PAGE);
  const start = (page - 1) * PER_PAGE + 1;
  const end = Math.min(page * PER_PAGE, totalCount);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-between">
      <p className="font-light text-sm text-ink">
        {totalCount}件中 {start}〜{end}件を表示
      </p>
      <nav className="flex items-center gap-1" aria-label="ページネーション">
        <Button
          variant="outline"
          size="icon"
          className={cn(subtleButton, 'w-12')}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="前のページ"
        >
          <FontAwesomeIcon icon={faChevronLeft} aria-hidden />
        </Button>
        {pages.map((pageNumber) => {
          const isCurrentPage = pageNumber === page;
          return (
            <Button
              key={pageNumber}
              variant={isCurrentPage ? 'default' : 'outline'}
              size="icon"
              className={cn('h-6 w-6 text-xs', !isCurrentPage && subtleButton)}
              aria-current={isCurrentPage ? 'page' : undefined}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="icon"
          className={cn(subtleButton, 'w-12')}
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          aria-label="次のページ"
        >
          <FontAwesomeIcon icon={faChevronRight} aria-hidden />
        </Button>
      </nav>
    </div>
  );
}
