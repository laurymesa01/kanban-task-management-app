import { useRef } from 'react';
import { useKanban } from '../context/KanbanContext';
import { usePortalAnchor } from '../hooks/usePortalAnchor';
import EllipsisMenu from './EllipsisMenu';
import StatusDropdown from "./StatusDropdown";

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => dispatch({ type: 'SELECT_TASK', payload: null })}>
      <div className="bg-white rounded-lg w-120 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>

        <div className="p-6 overflow-y-auto flex-1">
          <div className='flex items-center justify-between'>
            <h2 className="text-black">{task.title}</h2>
            <button ref={menuButtonRef} onClick={toggleMenu} className='cursor-pointer'>
              <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg"><g fill="#828FA3" fillRule="evenodd"><circle cx="2.308" cy="2.308" r="2.308"/><circle cx="2.308" cy="10" r="2.308"/><circle cx="2.308" cy="17.692" r="2.308"/></g></svg>
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
                  <div key={subtask.title} className="flex items-center gap-3 p-3 rounded-md bg-light-grey cursor-pointer hover:bg-main-purple-hover hover:opacity-100">
                    <input type="checkbox" checked={subtask.isCompleted} readOnly className="kanban-checkbox" />
                    <span className={`body-m ${subtask.isCompleted ? 'line-through text-medium-grey' : 'text-black'}`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          <p className="body-m text-medium-grey mb-2">Current Status</p>
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className="w-full flex items-center justify-between border border-lines-light rounded-md px-4 py-3 body-l text-black cursor-pointer active:border-main-purple focus:outline-none focus:ring-1 focus:ring-main-purple"
          >
            {task.status}
            <svg width="10" height="7" xmlns="http://www.w3.org/2000/svg">
              <path stroke="#635FC7" strokeWidth="2" fill="none" d={dropdownRect ? 'M9 6 5 2 1 6' : 'M1 1l4 4 4-4'} />
            </svg>
          </button>
        </div>
      </div>

      {menuRect && <EllipsisMenu pos={menuRect} onClose={closeMenu} items={[
        { label: 'Edit Task', onClick: () => {} },
        { label: 'Delete Task', onClick: () => {}, destructive: true },
      ]} />}
      {dropdownRect && <StatusDropdown pos={dropdownRect} columns={columns} currentStatus={task.status} onSelect={handleStatusChange} />}
    </div>
  );
};

export default TaskDetailPanel;
