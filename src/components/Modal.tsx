import type { ReactNode } from 'react';

const Modal = ({ onClose, children, className = '' }: { onClose: () => void; children: ReactNode; className?: string }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
    <div className={`bg-white dark:bg-dark-grey rounded-lg flex flex-col ${className}`} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

export default Modal;
