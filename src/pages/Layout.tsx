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

  return (
    <div className='flex h-screen'>
      <Sidebar/>
      <div className='flex flex-col flex-1'>
        <Header/>
        <Board/>
      </div>
      <TaskDetailPanel/>
      <NewTaskPanel/>
      <NewBoardPanel/>
      <DeleteConfirmModal
        isOpen={state.isDeleteBoardPanelOpen}
        title="Delete this board?"
        description={`Are you sure you want to delete the '${activeBoard.name}' board? This action will remove all columns and tasks and cannot be reversed.`}
        onConfirm={() => dispatch({ type: 'TOGGLE_DELETE_BOARD_PANEL' })}
        onCancel={() => dispatch({ type: 'TOGGLE_DELETE_BOARD_PANEL' })}
      />
      <DeleteConfirmModal
        isOpen={state.isDeleteTaskPanelOpen}
        title="Delete this task?"
        description={`Are you sure you want to delete the '${task?.title}' task and its subtasks? This action cannot be reversed.`}
        onConfirm={() => dispatch({ type: 'TOGGLE_DELETE_TASK_PANEL' })}
        onCancel={() => dispatch({ type: 'TOGGLE_DELETE_TASK_PANEL' })}
      />
    </div>
  )
}

export default Layout
