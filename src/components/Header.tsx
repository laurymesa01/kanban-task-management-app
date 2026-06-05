import { useRef } from 'react';
import { useKanban } from '../context/KanbanContext';
import { usePortalAnchor } from '../hooks/usePortalAnchor';
import EllipsisMenu from './EllipsisMenu';

const Header = () => {
  const { dispatch } = useKanban();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuRect, toggleMenu, closeMenu] = usePortalAnchor(menuButtonRef);

  const handleNewTaskPanel = () => dispatch({ type: 'TOGGLE_NEW_TASK_PANEL' });

  return (
    <header className="h-(--header-height) px-4 flex items-center justify-between border-b border-lines-light dark:border-lines-dark">
      <div className="flex items-center gap-30">
        <h1>Platform Launch</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="button-primary-l" onClick={handleNewTaskPanel}>
          <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFF" d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z"/>
          </svg>
          Add new task
        </button>
        <button ref={menuButtonRef} onClick={toggleMenu} className="cursor-pointer">
          <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg">
            <g fill="#828FA3" fillRule="evenodd"><circle cx="2.308" cy="2.308" r="2.308"/><circle cx="2.308" cy="10" r="2.308"/><circle cx="2.308" cy="17.692" r="2.308"/></g>
          </svg>
        </button>
      </div>
      {menuRect && <EllipsisMenu pos={menuRect} direction="below" onClose={closeMenu} items={[
        { label: 'Edit Board', onClick: () => {} },
        { label: 'Delete Board', onClick: () => dispatch({ type: 'TOGGLE_DELETE_BOARD_PANEL' }), destructive: true },
      ]} />}
    </header>
  )
}

export default Header
