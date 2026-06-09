import { useRef } from 'react';
import { useKanban } from '../context/KanbanContext';
import { usePortalAnchor } from '../hooks/usePortalAnchor';
import EllipsisMenu from './EllipsisMenu';
import { EllipsisIcon, PlusIcon } from './icons';
import logoLight from '../assets/logo-light.svg';
import logoDark from '../assets/logo-dark.svg';

const Header = ({ name }: { name: string }) => {
  const { dispatch } = useKanban();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuRect, toggleMenu, closeMenu] = usePortalAnchor(menuButtonRef);

  return (
    <header className="bg-white h-(--header-height) pr-4 flex justify-between border-b border-lines-light dark:border-lines-dark dark:bg-dark-grey">
      <div className='flex'>
        <div className='flex items-center pl-4 shrink-0 w-70 border-r border-lines-light dark:border-lines-dark'>
          <img src={logoLight} alt="Kanban" className="hidden dark:block" />
          <img src={logoDark} alt="Kanban" className="dark:hidden" />
        </div>
        <h1 className='ml-4 self-center'>{name}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="button-primary-l" onClick={() => dispatch({ type: 'TOGGLE_NEW_TASK_PANEL' })}>
          <PlusIcon />
          Add new task
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
