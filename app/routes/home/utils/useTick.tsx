import { useCallback, useEffect, useRef } from 'react';
import type { Canvas } from './useCanvas';

interface useTickArgs {
  context: CanvasRenderingContext2D | null;
  canvas: Canvas | null;
  onTick: () => void;
  tickLength: number;
}

interface useTickRtn {
  startTick: () => void;
  stopTick: () => void;
}

export function useTick({
  context,
  onTick,
  tickLength,
  canvas,
}: useTickArgs): useTickRtn {
  const interval = useRef<NodeJS.Timeout>(null);

  const stopTick = () => {
    if (interval.current) clearInterval(interval.current);
  }

  const startTick = useCallback(() => {
    stopTick();
    interval.current = setInterval(() => {
      context?.clearRect(
        0,
        0,
        canvas?.width ?? 0,
        canvas?.height ?? 0,
      );

      onTick();
    }, tickLength);
  }, [context, canvas, onTick]);

  return {
    stopTick,
    startTick,
  };
}
