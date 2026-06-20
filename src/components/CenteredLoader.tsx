import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function CenteredLoader() {
  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center bg-white/60"
      role="status"
      aria-live="polite"
    >
      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-brand" size="xl" aria-hidden />
      <span className="sr-only">読み込み中</span>
    </div>
  );
}
