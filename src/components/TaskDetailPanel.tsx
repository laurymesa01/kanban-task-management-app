import { useRef } from 'react';
import { useKanban } from '../context/KanbanContext';
import { usePortalAnchor } from '../hooks/usePortalAnchor';
import EllipsisMenu from './EllipsisMenu';
import StatusDropdown from './StatusDropdown';
import Modal from './Modal';
import { EllipsisIcon, ChevronIcon } from './icons';

const TaskDetailPanel = () => {
  const { state, dispatch } = useKanban();
  const task = state.selectedTask;
  const columns = state.boards[state.activeBoardIndex].columns;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownRect, toggleDropdown, closeDropdown] = usePortalAnchor(buttonRef);
  const [menuRect, toggleMenu, closeMenu] = usePortalAnchor(menuButtonRef);

  if (!task) return null;

  const completedCount = task.subtasks.filter(s => s.isCompleted).length;

  const handleStatusChange = (newStatus: string) => {
    dispatch({ type: 'MOVE_TASK', payload: { taskTitle: task.title, fromColumn: task.status, toColumn: newStatus } });
    closeDropdown();
  };

  const handleToggleSubtask = (subtaskTitle: string) => {
    dispatch({ type: 'TOGGLE_SUBTASK', payload: { taskTitle: task.title, subtaskTitle } });
  };

  return (
    <Modal onClose={() => dispatch({ type: 'SELECT_TASK', payload: null })} className="w-120 max-h-[90vh]">
      <div className="p-6 overflow-y-auto flex-1">
        <div className='flex items-center justify-between'>
          <h2 className="text-black dark:text-white">{task.title}</h2>
          <button ref={menuButtonRef} onClick={toggleMenu} className='cursor-pointer'>
            <EllipsisIcon />
          </button>
        </div>

        {task.description && (
          <p className="body-l text-medium-grey mt-4">{task.description}</p>
        )}

        {task.subtasks.length > 0 && (
          <div className="mt-6">
            <p className="body-m mb-4">Subtasks ({completedCount} of {task.subtasks.length})</p>
            <div className="flex flex-col gap-2">
              {task.subtasks.map(subtask => (
                <label key={subtask.title} className="flex items-center gap-3 p-3 rounded-md bg-light-grey dark:bg-very-dark-grey cursor-pointer hover:bg-main-purple/25">
                  <input
                    type="checkbox"
                    checked={subtask.isCompleted}
                    onChange={() => handleToggleSubtask(subtask.title)}
                    className="kanban-checkbox"
                  />
                  <span className={`body-m ${subtask.isCompleted ? 'line-through text-black/50 dark:text-white/50' : 'text-black dark:text-white'}`}>
                    {subtask.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-6">
        <p className="body-m text-medium-grey mb-2 dark:text-white">Current Status</p>
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between border border-lines-light dark:border-lines-dark rounded-md px-4 py-3 body-l text-black dark:text-white cursor-pointer active:border-main-purple focus:outline-none focus:ring-1 focus:ring-main-purple"
        >
          {task.status}
          <ChevronIcon isOpen={!!dropdownRect} />
        </button>
      </div>

      {menuRect && <EllipsisMenu pos={menuRect} onClose={closeMenu} items={[
        { label: 'Edit Task', onClick: () => { dispatch({ type: 'SELECT_TASK', payload: null }); } },
        { label: 'Delete Task', onClick: () => { dispatch({ type: 'TOGGLE_DELETE_TASK_PANEL' }); dispatch({ type: 'SELECT_TASK', payload: null }); }, destructive: true },
      ]} />}
      {dropdownRect && <StatusDropdown pos={dropdownRect} columns={columns} currentStatus={task.status} onSelect={handleStatusChange} />}
    </Modal>
  );
};

export default TaskDetailPanel;
