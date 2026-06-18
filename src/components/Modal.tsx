import { useEffect, useRef, type ReactNode } from 'react';

const Modal = ({ onClose, children, className = '', 'aria-labelledby': labelledBy, role = 'dialog' }: {
  onClose: () => void;
  children: ReactNode;
  className?: string;
  'aria-labelledby'?: string;
  role?: 'dialog' | 'alertdialog';
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current(); };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      if (prev && document.contains(prev)) prev.focus();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        ref={ref}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`bg-white dark:bg-dark-grey rounded-lg flex flex-col focus:outline-none ${className}`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
