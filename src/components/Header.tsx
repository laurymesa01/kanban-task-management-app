import { useRef } from 'react';
import { useKanban } from '../context/KanbanContext';
import { usePortalAnchor } from '../hooks/usePortalAnchor';
import EllipsisMenu from './EllipsisMenu';
import { ChevronIcon, EllipsisIcon, PlusIcon } from './icons';
import logoLight from '../assets/logo-light.svg';
import logoDark from '../assets/logo-dark.svg';
import logoMobile from '../assets/logo-mobile.svg';

const Header = ({ name, isSidebarOpen, onToggleSidebar }: { name: string; isSidebarOpen: boolean; onToggleSidebar: () => void }) => {
  const { state, dispatch } = useKanban();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuRect, toggleMenu, closeMenu] = usePortalAnchor(menuButtonRef);
  const hasNoColumns = state.boards[state.activeBoardIndex].columns.length === 0;

  return (
    <header className="bg-white h-(--header-height) pr-4 flex justify-between border-b border-lines-light dark:border-lines-dark dark:bg-dark-grey">
      <div className='flex items-center'>
        <div className='hidden md:flex items-center pl-4 shrink-0 w-70 h-full border-r border-lines-light dark:border-lines-dark'>
          <img src={logoLight} alt="Kanban" className="hidden dark:block" />
          <img src={logoDark} alt="Kanban" className="dark:hidden" />
        </div>
        <img src={logoMobile} alt="Kanban" className="md:hidden ml-4" />
        <button onClick={onToggleSidebar} className="md:hidden ml-4 flex items-center gap-2 cursor-pointer">
          <h1 className='self-center'>{name}</h1>
          <ChevronIcon isOpen={isSidebarOpen} />
        </button>
        <h1 className='hidden md:block ml-4 self-center'>{name}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="button-primary-l disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-main-purple px-3 md:px-6"
          disabled={hasNoColumns}
          onClick={() => dispatch({ type: 'TOGGLE_NEW_TASK_PANEL' })}
        >
          <PlusIcon />
          <span className="hidden md:inline">Add new task</span>
        </button>
        <button ref={menuButtonRef} onClick={toggleMenu} className="cursor-pointer">
          <EllipsisIcon />
        </button>
      </div>

      {menuRect && <EllipsisMenu pos={menuRect} direction="below" onClose={closeMenu} items={[
        { label: 'Edit Board', onClick: () => dispatch({ type: 'TOGGLE_EDIT_BOARD_PANEL' }) },
        { label: 'Delete Board', onClick: () => dispatch({ type: 'TOGGLE_DELETE_BOARD_PANEL' }), destructive: true },
      ]} />}
    </header>
  );
};

export default Header;
