import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from '@/components/ui/input';

type SearchInputProps = Readonly<{
  value: string;
  onChange: (value: string) => void;
}>;

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-md">
      <Input
        type="search"
        className="pr-9"
        placeholder="名前、ログインIDで検索"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="名前、ログインIDで検索"
      />
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink"
        aria-hidden
      />
    </div>
  );
}
