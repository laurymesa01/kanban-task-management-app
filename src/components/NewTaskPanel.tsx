import { useState, useRef } from 'react';
import { useKanban } from '../context/KanbanContext';
import StatusDropdown from './StatusDropdown';
import Modal from './Modal';
import { CrossIcon, ChevronIcon } from './icons';
import type { Status } from '../types/kanban';

const NewTaskPanel = () => {
  const { state, dispatch } = useKanban();
  const columns = state.boards[state.activeBoardIndex].columns;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState(['']);
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

  const addSubtask = () => setSubtasks(prev => [...prev, '']);

  const updateSubtask = (index: number, value: string) =>
    setSubtasks(prev => prev.map((s, i) => (i === index ? value : s)));

  const removeSubtask = (index: number) =>
    setSubtasks(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if (!title.trim()) return;
    const task = {
      title: title.trim(),
      description: description.trim(),
      status: selectedStatus as Status,
      subtasks: subtasks
        .filter(s => s.trim())
        .map(s => ({ title: s.trim(), isCompleted: false })),
    };
    dispatch({ type: 'ADD_TASK', payload: { columnName: selectedStatus, task } });
  };

  return (
    <Modal onClose={() => dispatch({ type: 'TOGGLE_NEW_TASK_PANEL' })} className="w-120 max-h-[90vh] p-6">
      <h2>Add New Task</h2>
      <form className='mt-6 flex flex-col gap-4' onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <label className='body-m text-medium-grey dark:text-white'>Title</label>
        <input
          type="text"
          className='input-form body-l'
          placeholder='e.g. Take coffee break'
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label className='body-m text-medium-grey dark:text-white'>Description</label>
        <textarea
          rows={7}
          className='input-form body-l'
          placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          value={description}
          onChange={e => setDescription(e.target.value)}
        >
        </textarea>
        <div>
          <label className='body-m text-medium-grey dark:text-white'>Subtasks</label>
          <div className='flex flex-col gap-3 mt-2 mb-4'>
            {subtasks.map((subtask, index) => (
              <div key={index} className='flex items-center gap-3'>
                <input
                  type="text"
                  className='input-form body-l'
                  placeholder='e.g. Make coffee'
                  value={subtask}
                  onChange={e => updateSubtask(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeSubtask(index)}
                  className='text-medium-grey hover:text-red cursor-pointer shrink-0'
                >
                  <CrossIcon />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addSubtask} className='button-secondary'>
            + Add New Subtask
          </button>
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
