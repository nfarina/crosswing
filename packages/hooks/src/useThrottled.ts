import { useEffect, useRef, useState } from "react";

export function useThrottled<T>(
  value: T,
  { limit = 1000 }: { limit?: number } = {},
) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());
  const timeLeft = Date.now() - lastRan.current;

  useEffect(() => {
    const handler = setTimeout(
      () => {
        setThrottledValue(value);
        lastRan.current = Date.now();
      },
      limit - (Date.now() - lastRan.current),
    );

    return () => {
      clearTimeout(handler);
    };
  }, [value, timeLeft]);

  return throttledValue;
}
