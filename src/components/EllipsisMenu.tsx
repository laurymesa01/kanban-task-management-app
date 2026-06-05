import { createPortal } from 'react-dom';

interface MenuItem {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

const EllipsisMenu = ({ pos, items, direction = 'right', onClose }: { pos: DOMRect; items: MenuItem[]; direction?: 'right' | 'below'; onClose: () => void }) => {
  const style = direction === 'below'
    ? { top: pos.bottom + 8, left: pos.right - 192 }
    : { top: pos.top, left: pos.right + 8 };

  return createPortal(
    <div
      className="fixed bg-white rounded-lg shadow-lg z-100 overflow-hidden w-48"
      style={style}
      onClick={e => e.stopPropagation()}
    >
      {items.map(item => (
        <button
          key={item.label}
          onClick={() => { item.onClick(); onClose(); }}
          className={`w-full text-left px-4 py-3 body-l cursor-pointer hover:bg-light-grey ${item.destructive ? 'text-red' : 'text-medium-grey'}`}
        >
          {item.label}
        </button>
      ))}
    </div>,
    document.body
  );
};

export default EllipsisMenu;
