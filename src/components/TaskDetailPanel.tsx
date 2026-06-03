import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useKanban } from '../context/KanbanContext';

const TaskDetailPanel = () => {
  const { state, dispatch } = useKanban();
  const task = state.selectedTask;
  const columns = state.boards[state.activeBoardIndex].columns;
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
          <h2 className="text-black">{task.title}</h2>

          {task.description && (
            <p className="body-l text-medium-grey mt-4">{task.description}</p>
          )}

          {task.subtasks.length > 0 && (
            <div className="mt-6">
              <p className="body-m mb-4">Subtasks ({completedCount} of {task.subtasks.length})</p>
              <div className="flex flex-col gap-2">
                {task.subtasks.map(subtask => (
                  <div key={subtask.title} className="flex items-center gap-3 p-3 rounded-md bg-light-grey">
                    <input
                      type="checkbox"
                      checked={subtask.isCompleted}
                      readOnly
                      className="accent-main-purple w-4 h-4 cursor-pointer"
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
