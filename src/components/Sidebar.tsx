import { useState, useEffect } from 'react';
import { useKanban } from '../context/KanbanContext';
import { BoardIcon, PlusIcon, SunIcon, MoonIcon, HideSidebarIcon } from './icons';
import Modal from './Modal';

const SidebarContent = ({ isDark, setIsDark, onSelectBoard }: { isDark: boolean; setIsDark: (fn: (d: boolean) => boolean) => void; onSelectBoard?: () => void }) => {
  const { state, dispatch } = useKanban();
  const { boards, activeBoardIndex } = state;

  return (
    <section className="h-full flex flex-col justify-between mt-8">
      <div className="pr-4">
        <p className="heading-s mb-6 ml-4">ALL BOARDS( {boards.length} )</p>
        <div className="flex flex-col">
          {boards.map((board, index) => (
            <button
              key={board.name}
              onClick={() => { dispatch({ type: 'SELECT_BOARD', payload: index }); onSelectBoard?.(); }}
              className={`py-4 px-6 flex items-center gap-2 cursor-pointer rounded-r-full hover:bg-main-purple/10 hover:text-main-purple dark:hover:bg-white dark:hover:text-main-purple ${index === activeBoardIndex ? 'text-white bg-main-purple' : 'text-medium-grey'}`}
            >
              <BoardIcon />
              <h3 className="heading-m">{board.name}</h3>
            </button>
          ))}
        </div>
        <button
          className="mt-4 py-2 px-6 flex items-center gap-2 text-main-purple heading-m cursor-pointer"
          onClick={() => dispatch({ type: 'TOGGLE_NEW_BOARD_PANEL' })}
        >
          <BoardIcon color="#635FC7" />
          <PlusIcon color="#635FC7" />
          Create new board
        </button>
      </div>

      <div className="px-4 mt-4">
        <div className="w-full flex items-center gap-2 justify-center bg-light-grey dark:bg-very-dark-grey rounded-md py-3">
          <SunIcon />
          <button
            onClick={() => setIsDark(d => !d)}
            className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer hover:bg-main-purple-hover transition-all ${isDark ? 'bg-main-purple justify-end' : 'bg-main-purple justify-start'}`}
            aria-label="Toggle dark mode"
          >
            <span className="w-3.5 h-3.5 bg-white rounded-full transition-all" />
          </button>
          <MoonIcon />
        </div>
      </div>
    </section>
  );
};

const HideSidebarButton = ({ onHide }: { onHide: () => void }) => (
  <button onClick={onHide} className="mt-6 px-4 py-4 heading-m text-medium-grey flex items-center gap-1 cursor-pointer rounded-r-full hover:bg-main-purple/10 hover:text-main-purple dark:hover:bg-white dark:hover:text-main-purple">
    <HideSidebarIcon />
    Hide Sidebar
  </button>
);

const Sidebar = ({ isOpen, isMobileOpen, onHide }: { isOpen: boolean; isMobileOpen: boolean; onHide: () => void }) => {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', String(isDark));
  }, [isDark]);

  return (
    <>
      <aside className={`hidden md:flex flex-col bg-white dark:bg-dark-grey shrink-0 h-full pb-8 border-r border-lines-light dark:border-lines-dark overflow-hidden transition-all duration-300 ${isOpen ? 'w-70' : 'w-0'}`}>
        <SidebarContent isDark={isDark} setIsDark={setIsDark} />
        <HideSidebarButton onHide={onHide} />
      </aside>

      {isMobileOpen && (
        <Modal onClose={onHide} className="w-70 max-h-[80vh] py-4 overflow-y-auto md:hidden">
          <SidebarContent isDark={isDark} setIsDark={setIsDark} onSelectBoard={onHide} />
        </Modal>
      )}
    </>
  );
};

export default Sidebar;
