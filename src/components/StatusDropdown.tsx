import { createPortal } from 'react-dom';
import { useRef, useEffect, useState } from 'react';

const StatusDropdown = ({ pos, columns, currentStatus, onSelect, onClose, 'aria-labelledby': labelledBy }: {
  pos: DOMRect;
  columns: { name: string }[];
  currentStatus: string;
  onSelect: (status: string) => void;
  onClose?: () => void;
  'aria-labelledby'?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(pos.bottom + 4);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const dropdownHeight = ref.current.offsetHeight;
    const spaceBelow = window.innerHeight - pos.bottom;
    setTop(spaceBelow < dropdownHeight + 8 ? pos.top - dropdownHeight - 4 : pos.bottom + 4);
    setVisible(true);
  }, [pos]);

  useEffect(() => {
    if (!onClose) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopImmediatePropagation(); onClose(); }
    };
    document.addEventListener('keydown', handleKey, true);
    return () => document.removeEventListener('keydown', handleKey, true);
  }, [onClose]);

  return createPortal(
    <div
      ref={ref}
      role="listbox"
      aria-labelledby={labelledBy}
      className="fixed bg-white dark:bg-very-dark-grey rounded-md shadow-lg z-100 overflow-hidden"
      style={{ top, left: pos.left, width: pos.width, visibility: visible ? 'visible' : 'hidden' }}
      onClick={e => e.stopPropagation()}
    >
      {columns.map(col => (
        <div
          key={col.name}
          role="option"
          aria-selected={currentStatus === col.name}
          tabIndex={0}
          onClick={() => onSelect(col.name)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(col.name); } }}
          className={`px-4 py-3 body-l rounded-md cursor-pointer hover:bg-light-grey dark:hover:bg-very-dark-grey hover:text-main-purple ${currentStatus === col.name ? 'bg-light-grey dark:bg-very-dark-grey text-main-purple' : 'bg-white dark:bg-dark-grey text-medium-grey'}`}
        >
          {col.name}
        </div>
      ))}
    </div>,
    document.body
  );
};

export default StatusDropdown;
