import { createPortal } from 'react-dom';

const StatusDropdown = ({ pos, columns, currentStatus, onSelect }: {
  pos: DOMRect;
  columns: { name: string }[];
  currentStatus: string;
  onSelect: (status: string) => void;
}) =>
  createPortal(
    <div
      className="fixed bg-white rounded-md shadow-lg z-100 overflow-hidden"
      style={{ top: pos.bottom + 4, left: pos.left, width: pos.width }}
      onClick={e => e.stopPropagation()}
    >
      {columns.map(col => (
        <button
          key={col.name}
          onClick={() => onSelect(col.name)}
          className={`w-full text-left px-4 py-3 body-l rounded-md cursor-pointer hover:bg-light-grey hover:text-main-purple ${currentStatus === col.name ? 'bg-light-grey text-main-purple' : 'bg-white text-medium-grey'}`}
        >
          {col.name}
        </button>
      ))}
    </div>,
    document.body
  );

  export default StatusDropdown;