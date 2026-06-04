import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useKanban } from '../context/KanbanContext';

const TaskDetailPanel = () => {
  const { state, dispatch } = useKanban();
  const task = state.selectedTask;
  const columns = state.boards[state.activeBoardIndex].columns;
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  if (!task) return null;

  const completedCount = task.subtasks.filter(s => s.isCompleted).length;

  const handleToggleDropdown = () => {
    if (dropdownPos) {
      setDropdownPos(null);
      return;
    }
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  };

  const handleToggleMenu = () => {
    if (menuPos) {
      setMenuPos(null);
      return;
    }
    if (menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.top, left: rect.right });
    }
  };

  const handleStatusChange = (newStatus: string) => {
    dispatch({
      type: 'MOVE_TASK',
      payload: { taskTitle: task.title, fromColumn: task.status, toColumn: newStatus }
    });
    setDropdownPos(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => dispatch({ type: 'SELECT_TASK', payload: null })}>
      <div className="bg-white rounded-lg w-120 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>

        <div className="p-6 overflow-y-auto flex-1">
          <div className='flex items-center justify-between'>
            <h2 className="text-black">{task.title}</h2>
            <button ref={menuButtonRef} onClick={handleToggleMenu} className='cursor-pointer'>
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
                    <input
                      type="checkbox"
                      checked={subtask.isCompleted}
                      readOnly
                      className="appearance-none w-4 h-4 rounded cursor-pointer border border-lines-light checked:bg-main-purple checked:border-main-purple checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20stroke%3D%22%23fff%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20d%3D%22M3%208l3%203%207-7%22%2F%3E%3C%2Fsvg%3E')] bg-center bg-no-repeat shrink-0"
                    />
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
            onClick={handleToggleDropdown}
            className="w-full flex items-center justify-between border border-lines-light rounded-md px-4 py-3 body-l text-black cursor-pointer active:border-main-purple focus:outline-none focus:ring-1 focus:ring-main-purple"
          >
            {task.status}
            <svg width="10" height="7" xmlns="http://www.w3.org/2000/svg">
              <path stroke="#635FC7" strokeWidth="2" fill="none" d={dropdownPos ? 'M9 6 5 2 1 6' : 'M1 1l4 4 4-4'} />
            </svg>
          </button>
        </div>
      </div>

      {menuPos && createPortal(
        <div
          className="fixed bg-white rounded-lg shadow-lg z-100 overflow-hidden w-48"
          style={{ top: menuPos.top, left: menuPos.left + 8 }}
          onClick={e => e.stopPropagation()}
        >
          <button className="w-full text-left px-4 py-3 body-l text-medium-grey cursor-pointer hover:bg-light-grey">
            Edit Task
          </button>
          <button className="w-full text-left px-4 py-3 body-l text-red cursor-pointer hover:bg-light-grey">
            Delete Task
          </button>
        </div>,
        document.body
      )}

      {dropdownPos && createPortal(
        <div
          className="fixed bg-white rounded-md shadow-lg z-100 overflow-hidden"
          style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}
          onClick={e => e.stopPropagation()}
        >
          {columns.map(col => (
            <button
              key={col.name}
              onClick={() => handleStatusChange(col.name)}
              className={`w-full text-left px-4 py-3 body-l rounded-md cursor-pointer hover:bg-light-grey hover:text-main-purple ${task.status === col.name ? 'bg-light-grey text-main-purple' : 'bg-white text-medium-grey'}`}
            >
              {col.name}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default TaskDetailPanel;
