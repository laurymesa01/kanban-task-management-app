import { useState } from 'react';
import Board from '../components/Board';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Header from '../components/Header';
import NewBoardPanel from '../components/NewBoardPanel';
import NewTaskPanel from '../components/NewTaskPanel';
import Sidebar from '../components/Sidebar';
import TaskDetailPanel from '../components/TaskDetailPanel';
import { useKanban } from '../context/KanbanContext';

const Layout = () => {
  const { state, dispatch } = useKanban();
  const activeBoard = state.boards[state.activeBoardIndex];
  const task = state.selectedTask;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const hideSidebar = () => {
    setIsSidebarOpen(false);
    setIsMobileSidebarOpen(false);
  };

  if (!activeBoard) return (
    <div className='flex flex-col h-screen'>
      <Sidebar isOpen={isSidebarOpen} isMobileOpen={isMobileSidebarOpen} onHide={hideSidebar} />
      {(state.isNewBoardPanelOpen || state.isEditBoardPanelOpen) && <NewBoardPanel />}
    </div>
  );

  return (
    <div className='flex flex-col h-screen'>
      <Header name = {activeBoard.name} isSidebarOpen={isMobileSidebarOpen} onToggleSidebar={() => setIsMobileSidebarOpen(o => !o)} />
      <div className='flex flex-row flex-1'>
        <Sidebar isOpen={isSidebarOpen} isMobileOpen={isMobileSidebarOpen} onHide={hideSidebar} />
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="hidden md:block fixed bottom-8 left-0 bg-main-purple hover:bg-main-purple-hover px-5 py-4 rounded-r-full cursor-pointer z-10"
            aria-label="Show sidebar"
          >
            <svg width="16" height="11" xmlns="http://www.w3.org/2000/svg"><path d="M15.815 4.434A9.055 9.055 0 0 0 8 0 9.055 9.055 0 0 0 .185 4.434a1.333 1.333 0 0 0 0 1.354A9.055 9.055 0 0 0 8 10.222a9.055 9.055 0 0 0 7.815-4.434 1.333 1.333 0 0 0 0-1.354ZM8 8.89A3.776 3.776 0 0 1 4.222 5.11 3.776 3.776 0 0 1 8 1.333a3.776 3.776 0 0 1 3.778 3.778A3.776 3.776 0 0 1 8 8.89Zm0-6.222a2.417 2.417 0 0 0-.718.107 1.333 1.333 0 0 1-1.867 1.867A2.444 2.444 0 1 0 8 2.667Z" fill="#fff"/></svg>
          </button>
        )}
        <Board/>
      </div>
      <TaskDetailPanel/>
      {(state.isNewTaskPanelOpen || state.isEditTaskPanelOpen) && <NewTaskPanel/>}
      {(state.isNewBoardPanelOpen || state.isEditBoardPanelOpen) && <NewBoardPanel />}
      <DeleteConfirmModal
        isOpen={state.isDeleteBoardPanelOpen}
        title="Delete this board?"
        description={`Are you sure you want to delete the '${activeBoard.name}' board? This action will remove all columns and tasks and cannot be reversed.`}
        onConfirm={() => dispatch({ type: 'DELETE_BOARD' })}
        onCancel={() => dispatch({ type: 'TOGGLE_DELETE_BOARD_PANEL' })}
      />
      <DeleteConfirmModal
        isOpen={state.isDeleteTaskPanelOpen}
        title="Delete this task?"
        description={`Are you sure you want to delete the '${task?.title}' task and its subtasks? This action cannot be reversed.`}
        onConfirm={() => dispatch({ type: 'DELETE_TASK' })}
        onCancel={() => dispatch({ type: 'TOGGLE_DELETE_TASK_PANEL' })}
      />
    </div>
  )
}

export default Layout
