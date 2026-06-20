import { faChalkboardUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function PageTitle() {
  return (
    <div className="flex items-center gap-4">
      <FontAwesomeIcon icon={faChalkboardUser} className="text-ink text-[26px]" aria-hidden />
      <h1 className="text-2xl font-semibold text-ink">先生</h1>
    </div>
  );
}
