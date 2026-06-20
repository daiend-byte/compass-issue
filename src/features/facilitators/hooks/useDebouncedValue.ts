import { useEffect, useState } from 'react';

/** 値の変化を `delayMs` だけ遅延させて返す。検索入力の過剰リクエスト抑制に用いる。 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
