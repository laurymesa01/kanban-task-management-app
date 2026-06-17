import { useState, useRef } from 'react';
import { useKanban } from '../context/KanbanContext';
import { usePortalAnchor } from '../hooks/usePortalAnchor';
import { useEditableList } from '../hooks/useEditableList';
import StatusDropdown from './StatusDropdown';
import Modal from './Modal';
import { CrossIcon, ChevronIcon } from './icons';
import type { Status } from '../types/kanban';

const NewTaskPanel = () => {
  const { state, dispatch } = useKanban();
  const isEditMode = state.isEditTaskPanelOpen;
  const task = state.selectedTask;
  const columns = state.boards[state.activeBoardIndex].columns;
  const [title, setTitle] = useState(isEditMode && task ? task.title : '');
  const [description, setDescription] = useState(isEditMode && task ? task.description : '');
  const subtaskList = useEditableList(
    isEditMode && task && task.subtasks.length > 0 ? task.subtasks.map(s => s.title) : ['']
  );
  const [selectedStatus, setSelectedStatus] = useState(
    isEditMode && task ? task.status : (columns[0]?.name ?? '')
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownRect, toggleDropdown, closeDropdown] = usePortalAnchor(buttonRef);
  const [titleError, setTitleError] = useState<string | null>(null);

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    closeDropdown();
  };

  const handleClose = () =>
    dispatch({ type: isEditMode ? 'TOGGLE_EDIT_TASK_PANEL' : 'TOGGLE_NEW_TASK_PANEL' });

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const isListValid = subtaskList.validate();

    let error: string | null = null;
    if (!trimmedTitle) {
      error = "Can't be empty";
    } else {
      const allTasks = columns.flatMap(col => col.tasks);
      const isDuplicate = isEditMode && task
        ? allTasks.some(t => t.title === trimmedTitle && t.title !== task.title)
        : allTasks.some(t => t.title === trimmedTitle);
      if (isDuplicate) error = 'Already exists';
    }

    setTitleError(error);
    if (error || !isListValid) return;

    const newTask = {
      title: trimmedTitle,
      description: description.trim(),
      status: selectedStatus as Status,
      subtasks: subtaskList.items.map(s => ({ title: s.trim(), isCompleted: false })),
    };
    if (isEditMode && task) {
      dispatch({ type: 'EDIT_TASK', payload: { originalTitle: task.title, originalStatus: task.status, task: newTask } });
    } else {
      dispatch({ type: 'ADD_TASK', payload: { columnName: selectedStatus, task: newTask } });
    }
  };

  return (
    <Modal onClose={handleClose} className="w-[90vw] md:w-120 max-h-[80vh] p-6 overflow-y-auto">
      <h2>{isEditMode ? 'Edit Task' : 'Add New Task'}</h2>
      <form className='mt-6 flex flex-col gap-4' onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <label className='body-m text-medium-grey dark:text-white'>Title</label>
        <div className='relative'>
          <input
            type="text"
            className={`input-form body-l ${titleError ? 'border-red' : ''}`}
            placeholder='e.g. Take coffee break'
            value={title}
            onChange={e => { setTitle(e.target.value); if (e.target.value.trim()) setTitleError(null); }}
          />
          {titleError && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 body-l text-red">{titleError}</span>
          )}
        </div>
        <label className='body-m text-medium-grey dark:text-white'>Description</label>
        <textarea
          rows={4}
          className='input-form body-l'
          placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <div>
          <label className='body-m text-medium-grey dark:text-white'>Subtasks</label>
          <div className='flex flex-col gap-3 mt-2 mb-4'>
            {subtaskList.items.map((subtask, index) => (
              <div key={index} className='flex items-center gap-3'>
                <div className='relative flex-1'>
                  <input
                    type="text"
                    className={`input-form body-l ${subtaskList.errors[index] ? 'border-red' : ''}`}
                    placeholder='e.g. Make coffee'
                    value={subtask}
                    onChange={e => subtaskList.update(index, e.target.value)}
                  />
                  {subtaskList.errors[index] && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 body-l text-red">Can't be empty</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => subtaskList.remove(index)}
                  className='text-medium-grey hover:text-red cursor-pointer shrink-0'
                >
                  <CrossIcon />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={subtaskList.add} className='button-secondary'>
            + Add New Subtask
          </button>
        </div>
        <label className='body-m text-medium-grey dark:text-white'>Status</label>
        <button
          type="button"
          ref={buttonRef}
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between border border-lines-light dark:border-lines-dark rounded-md px-4 py-3 body-l text-black dark:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-main-purple"
        >
          {selectedStatus}
          <ChevronIcon isOpen={!!dropdownRect} />
        </button>
        <button className='button-primary-s'>{isEditMode ? 'Save Changes' : 'Create Task'}</button>
      </form>

      {dropdownRect && <StatusDropdown pos={dropdownRect} columns={columns} currentStatus={selectedStatus} onSelect={handleStatusSelect} />}
    </Modal>
  );
};

export default NewTaskPanel;
