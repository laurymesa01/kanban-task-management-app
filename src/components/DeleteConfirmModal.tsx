interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal = ({ isOpen, title, description, onConfirm, onCancel }: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white dark:bg-dark-grey p-6 rounded-lg w-90 flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-red">{title}</h2>
        <p className="body-l text-medium-grey mt-4">{description}</p>
        <div className="flex items-center gap-3 mt-6">
          <button className="button-destructive" onClick={onConfirm}>Delete</button>
          <button className="button-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
