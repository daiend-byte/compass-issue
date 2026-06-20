import type { Facilitator } from '../types';

export function FacilitatorRow({ facilitator }: { facilitator: Facilitator }) {
  return (
    <tr className="font-light odd:bg-surface even:bg-white">
      <td className="border-b border-border-row px-4 py-3 text-base text-ink">
        <p className="truncate">{facilitator.name}</p>
      </td>
      <td className="border-b border-border-row px-4 py-3 text-xs text-ink">
        <p className="truncate">{facilitator.loginId}</p>
      </td>
      <td className="border-b border-border-row" aria-hidden={true}></td>
    </tr>
  );
}
