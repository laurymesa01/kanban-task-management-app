import Modal from './Modal';

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
    <Modal onClose={onCancel} role="alertdialog" aria-labelledby="delete-confirm-title" className="p-6 w-[90vw] md:w-90">
      <h2 id="delete-confirm-title" className="text-red">{title}</h2>
      <p className="body-l text-medium-grey mt-4">{description}</p>
      <div className="flex items-center gap-3 mt-6">
        <button className="button-destructive" onClick={onConfirm}>Delete</button>
        <button className="button-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
