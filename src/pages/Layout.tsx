import Board from '../components/Board';
import DeleteBoard from '../components/DeleteBoard';
import Header from '../components/Header';
import NewBoardPanel from '../components/NewBoardPanel';
import NewTaskPanel from '../components/NewTaskPanel';
import Sidebar from '../components/Sidebar';
import TaskDetailPanel from '../components/TaskDetailPanel';

const Layout = () => {
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
        <DeleteBoard/>
    </div>
  )
}

export default Layout