import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';

interface MenuItem {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

const EllipsisMenu = ({ pos, items, direction = 'right', onClose }: {
  pos: DOMRect;
  items: MenuItem[];
  direction?: 'right' | 'below';
  onClose: () => void;
}) => {
  const style = direction === 'below'
    ? { top: pos.bottom + 8, left: pos.right - 192 }
    : { top: pos.top, left: pos.right + 8 };

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopImmediatePropagation(); onClose(); }
    };
    document.addEventListener('keydown', handleKey, true);
    return () => document.removeEventListener('keydown', handleKey, true);
  }, [onClose]);

  return createPortal(
    <div
      ref={ref}
      role="menu"
      aria-orientation="vertical"
      className="fixed bg-white dark:bg-very-dark-grey rounded-lg shadow-lg z-100 overflow-hidden w-48"
      style={style}
      onClick={e => e.stopPropagation()}
    >
      {items.map(item => (
        <button
          key={item.label}
          role="menuitem"
          onClick={() => { item.onClick(); onClose(); }}
          className={`w-full text-left px-4 py-3 body-l cursor-pointer hover:bg-light-grey dark:hover:bg-dark-grey ${item.destructive ? 'text-red' : 'text-medium-grey'}`}
        >
          {item.label}
        </button>
      ))}
    </div>,
    document.body
  );
};

export default EllipsisMenu;
