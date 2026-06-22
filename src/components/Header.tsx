import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import logoWhiteUrl from '@/assets/logo-white.svg';

export function Header() {
  return (
    <header className="bg-brand text-white">
      <div className="mx-auto flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <img src={logoWhiteUrl} alt="Compass" className="h-8" />
          </Link>
          <Button
            variant="ghost"
            className="h-auto rounded border border-white py-1 text-base font-normal text-white hover:bg-white/10 hover:text-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand focus-visible:ring-white"
          >
            アカウント管理
          </Button>
        </div>
        <span className="flex items-center gap-2 text-base">
          <FontAwesomeIcon icon={faCircleUser} size="xl" aria-hidden />
          因幡深雪
        </span>
      </div>
    </header>
  );
}
