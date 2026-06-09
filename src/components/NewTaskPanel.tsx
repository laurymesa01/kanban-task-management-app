import { useState, useRef } from 'react';
import { useKanban } from '../context/KanbanContext';
import StatusDropdown from './StatusDropdown';
import Modal from './Modal';
import { CrossIcon, ChevronIcon } from './icons';

const NewTaskPanel = () => {
  const { state, dispatch } = useKanban();
  const columns = state.boards[state.activeBoardIndex].columns;
  const [selectedStatus, setSelectedStatus] = useState(columns[0]?.name ?? '');
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  if (!state.isNewTaskPanelOpen) return null;

  const handleToggleDropdown = () => {
    if (dropdownRect) { setDropdownRect(null); return; }
    if (buttonRef.current) setDropdownRect(buttonRef.current.getBoundingClientRect());
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setDropdownRect(null);
  };

  return (
    <Modal onClose={() => dispatch({ type: 'TOGGLE_NEW_TASK_PANEL' })} className="w-120 max-h-[90vh] p-6">
      <h2>Add New Task</h2>
      <form className='mt-6 flex flex-col gap-4'>
        <label className='body-m text-medium-grey dark:text-white'>Title</label>
        <input type="text" className='input-form body-l' placeholder='e.g. Take coffee break'/>
        <label className='body-m text-medium-grey dark:text-white'>Description</label>
        <textarea
          rows={7}
          className='input-form body-l'
          placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little.">
        </textarea>
        <div>
          <label className='body-m text-medium-grey dark:text-white'>Subtasks</label>
          <div className='flex items-center gap-3 mt-2 mb-4'>
            <input type="text" className='input-form body-l' placeholder='e.g. Make coffee'/>
            <button type="button" className='text-medium-grey hover:text-red cursor-pointer'>
              <CrossIcon />
            </button>
          </div>
          <button type="button" className='button-secondary'>+ Add New Subtask</button>
        </div>
        <label className='body-m text-medium-grey dark:text-white'>Status</label>
        <button
          type="button"
          ref={buttonRef}
          onClick={handleToggleDropdown}
          className="w-full flex items-center justify-between border border-lines-light dark:border-lines-dark rounded-md px-4 py-3 body-l text-black dark:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-main-purple"
        >
          {selectedStatus}
          <ChevronIcon isOpen={!!dropdownRect} />
        </button>
        <button className='button-primary-s'>Create Task</button>
      </form>

      {dropdownRect && <StatusDropdown pos={dropdownRect} columns={columns} currentStatus={selectedStatus} onSelect={handleStatusSelect} />}
    </Modal>
  );
};

export default NewTaskPanel;
