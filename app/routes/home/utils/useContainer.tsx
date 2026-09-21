import { type RefObject, useLayoutEffect, useRef, useState } from "react";

export function useContainer(): [RefObject<HTMLDivElement | null>, number, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<[number, number]>([0, 0]);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const clientRect = ref.current.getBoundingClientRect();
    setContainer([clientRect.width, clientRect.height]);
  }, []);

  return [ref, ...container];
}
