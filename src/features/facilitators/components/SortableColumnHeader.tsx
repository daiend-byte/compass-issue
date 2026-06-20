import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cn } from '@/lib/utils';
import type { SortKey, SortOrder } from '../types';

type SortableColumnHeaderProps = Readonly<{
  label: string;
  columnKey: SortKey;
  activeKey: SortKey;
  order: SortOrder;
  onToggle: (key: SortKey) => void;
  className?: string;
}>;

export function SortableColumnHeader({
  label,
  columnKey,
  activeKey,
  order,
  onToggle,
  className,
}: SortableColumnHeaderProps) {
  const isActive = activeKey === columnKey;
  const icon = isActive && order === 'desc' ? faChevronUp : faChevronDown;

  return (
    <th
      scope="col"
      aria-sort={isActive ? (order === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={cn(
        'p-0 text-left text-xs font-semibold text-white',
        isActive ? 'bg-brand' : 'bg-brand-light',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(columnKey)}
        className="flex w-full cursor-pointer items-center justify-between gap-1 px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        aria-label={`${label}で並び替え`}
      >
        <span>{label}</span>
        <FontAwesomeIcon
          icon={icon}
          className={cn(isActive ? 'text-white' : 'text-subtle')}
          aria-hidden
        />
      </button>
    </th>
  );
}
