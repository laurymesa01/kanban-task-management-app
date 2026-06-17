import { createPortal } from 'react-dom';
import { useRef, useEffect, useState } from 'react';

const StatusDropdown = ({ pos, columns, currentStatus, onSelect }: {
  pos: DOMRect;
  columns: { name: string }[];
  currentStatus: string;
  onSelect: (status: string) => void;
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

  return createPortal(
    <div
      ref={ref}
      className="fixed bg-white dark:bg-very-dark-grey rounded-md shadow-lg z-100 overflow-hidden"
      style={{ top, left: pos.left, width: pos.width, visibility: visible ? 'visible' : 'hidden' }}
      onClick={e => e.stopPropagation()}
    >
      {columns.map(col => (
        <button
          key={col.name}
          onClick={() => onSelect(col.name)}
          className={`w-full text-left px-4 py-3 body-l rounded-md cursor-pointer hover:bg-light-grey dark:hover:bg-very-dark-grey hover:text-main-purple ${currentStatus === col.name ? 'bg-light-grey dark:bg-very-dark-grey text-main-purple' : 'bg-white dark:bg-dark-grey text-medium-grey'}`}
        >
          {col.name}
        </button>
      ))}
    </div>,
    document.body
  );
};

export default StatusDropdown;
