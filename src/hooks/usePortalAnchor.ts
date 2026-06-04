import { useState, type RefObject } from 'react';

export function usePortalAnchor<T extends HTMLElement>(ref: RefObject<T>) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const toggle = () => setRect(r => r ? null : ref.current?.getBoundingClientRect() ?? null);
  const close = () => setRect(null);
  return [rect, toggle, close] as const;
}
