import { useState, useRef } from 'react';
import { useKanban } from '../context/KanbanContext';
import StatusDropdown from './StatusDropdown';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => dispatch({ type: 'TOGGLE_NEW_TASK_PANEL' })}>
      <div className="bg-white dark:bg-dark-grey p-6 rounded-lg w-120 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <h2>Add New Task</h2>
        <form className='mt-6 flex flex-col gap-4'>
          <label className='body-m text-medium-grey dark:text-white'>Title</label>
          <input type="text" className='input-form body-l' placeholder='e.g. Take coffee break'/>
          <label className='body-m text-medium-grey dark:text-white'>Description</label>
          <textarea 
            name="" 
            id="" 
            rows={7} 
            className='input-form body-l' 
            placeholder='e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little.'>
          </textarea>
          <div>
            <label className='body-m text-medium-grey dark:text-white'>Subtasks</label>
            <div className='flex items-center gap-3 mt-2 mb-4'>
              <input type="text" className='input-form body-l' placeholder='e.g. Make coffee'/>
              <button className='group text-medium-grey hover:text-red cursor-pointer'>
                <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fillRule="evenodd"><path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z"/><path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z"/></g></svg>
              </button>
            </div>
            <button className='button-secondary'>+ Add New Subtask</button>
          </div>
          <label className='body-m text-medium-grey dark:text-white'>Status</label>
          <button
            type="button"
            ref={buttonRef}
            onClick={handleToggleDropdown}
            className="w-full flex items-center justify-between border border-lines-light dark:border-lines-dark rounded-md px-4 py-3 body-l text-black dark:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-main-purple"
          >
            {selectedStatus}
            <svg width="10" height="7" xmlns="http://www.w3.org/2000/svg">
              <path stroke="#635FC7" strokeWidth="2" fill="none" d={dropdownRect ? 'M9 6 5 2 1 6' : 'M1 1l4 4 4-4'} />
            </svg>
          </button>
          <button className='button-primary-s'>Create Task</button>
        </form>
      </div>

      {dropdownRect && <StatusDropdown pos={dropdownRect} columns={columns} currentStatus={selectedStatus} onSelect={handleStatusSelect} />}
    </div>
  )
}

export default NewTaskPanel;