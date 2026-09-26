import { useEffect, useRef, useState, type RefObject } from 'react';

export type Canvas = Record<'width' | 'height', number>;

interface useCanvasRtn {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  canvas: Canvas | null;
  context: CanvasRenderingContext2D | null;
}

export function useCanvas(): useCanvasRtn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    function update() {
      if (!el || !el.width || !el.height) return;
      setContext(el.getContext('2d'));
      setCanvas({ width: el.width, height: el.height });
    }

    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return {
    context,
    canvasRef,
    canvas,
  };
}
