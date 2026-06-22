import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

type SearchInputProps = Readonly<{
  value: string;
  onChange: (value: string) => void;
}>;

export function SearchInput({ value, onChange }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const isComposing = useRef(false);

  // 外部（URL）から value が変わったとき（例：ブラウザ戻るボタン）は localValue を同期する。
  // ナビゲーションが発生した時点で IME セッションは中断されているため、isComposing もリセットする。
  useEffect(() => {
    isComposing.current = false;
    setLocalValue(value);
  }, [value]);

  return (
    <div className="relative w-full max-w-md">
      <Input
        type="search"
        className="pr-9"
        placeholder="名前、ログインIDで検索"
        value={localValue}
        onChange={(event) => {
          setLocalValue(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
            onChange(localValue);
          }
        }}
        onCompositionStart={() => {
          isComposing.current = true;
        }}
        onCompositionEnd={() => {
          isComposing.current = false;
        }}
        aria-label="名前、ログインIDで検索"
      />
      <button
        type="button"
        onClick={() => onChange(localValue)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink hover:text-brand hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded"
        aria-label="検索"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </div>
  );
}
