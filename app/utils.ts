'use client';
import type { EventHandler, MouseEvent, KeyboardEvent } from 'react';

export function a11yButton(
  handlerFn: EventHandler<KeyboardEvent | MouseEvent>
) {
  return {
    onClick: handlerFn,
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'Enter') handlerFn(event);
    },
  };
}
