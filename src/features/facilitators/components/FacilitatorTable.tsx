import type { Facilitator, SortKey, SortOrder } from '../types';
import { FacilitatorRow } from './FacilitatorRow';
import { SortableColumnHeader } from './SortableColumnHeader';

type FacilitatorTableProps = Readonly<{
  facilitators: Facilitator[];
  sort: SortKey;
  order: SortOrder;
  onToggleSort: (key: SortKey) => void;
}>;

export function FacilitatorTable({
  facilitators,
  sort,
  order,
  onToggleSort,
}: FacilitatorTableProps) {
  return (
    <table className="w-full table-fixed">
      <colgroup>
        <col className="w-[36%]" />
        <col className="w-[36%]" />
        <col className="w-[28%]" />
      </colgroup>
      <thead className="relative z-10">
        <tr>
          <SortableColumnHeader
            label="名前"
            columnKey="name"
            activeKey={sort}
            order={order}
            onToggle={onToggleSort}
          />
          <SortableColumnHeader
            label="ログインID"
            columnKey="loginId"
            activeKey={sort}
            order={order}
            onToggle={onToggleSort}
            className="border-l border-subtle"
          />
          {/* デザインに合わせた右端フィラー列（ラベルなし・クリック不可） */}
          <th scope="col" className="border-l border-subtle bg-brand-light" aria-hidden>
            {''}
          </th>
        </tr>
      </thead>
      <tbody className="border-x border-line">
        {facilitators.map((facilitator) => (
          <FacilitatorRow key={facilitator.id} facilitator={facilitator} />
        ))}
      </tbody>
    </table>
  );
}
