import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';
import Modal from './Modal';
import { CrossIcon } from './icons';

const NewBoardPanel = () => {
  const { state, dispatch } = useKanban();
  const isEditMode = state.isEditBoardPanelOpen;
  const activeBoard = state.boards[state.activeBoardIndex];

  const [boardName, setBoardName] = useState(isEditMode ? activeBoard.name : '');
  const [columns, setColumns] = useState(
    isEditMode ? activeBoard.columns.map(col => col.name) : ['Todo', 'Doing']
  );

  const addColumn = () => setColumns(prev => [...prev, '']);

  const updateColumn = (index: number, value: string) =>
    setColumns(prev => prev.map((col, i) => (i === index ? value : col)));

  const removeColumn = (index: number) =>
    setColumns(prev => prev.filter((_, i) => i !== index));

  const handleClose = () =>
    dispatch({ type: isEditMode ? 'TOGGLE_EDIT_BOARD_PANEL' : 'TOGGLE_NEW_BOARD_PANEL' });

  const handleSubmit = () => {
    if (!boardName.trim()) return;
    const payload = {
      name: boardName.trim(),
      columns: columns
        .filter(col => col.trim())
        .map(col => ({ name: col.trim(), tasks: [] })),
    };
    dispatch({ type: isEditMode ? 'EDIT_BOARD' : 'ADD_BOARD', payload });
  };

  return (
    <Modal onClose={handleClose} className="w-90 max-h-[90vh] p-6">
      <h2>{isEditMode ? 'Edit Board' : 'Add New Board'}</h2>
      <form className='mt-6 flex flex-col gap-4' onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <label className='body-m text-medium-grey dark:text-white'>Name</label>
        <input
          type="text"
          className='input-form body-l'
          placeholder='e.g. Web design'
          value={boardName}
          onChange={e => setBoardName(e.target.value)}
        />
        <div>
          <label className='body-m text-medium-grey dark:text-white'>Columns</label>
          <div className='flex flex-col gap-3 mt-2 mb-4'>
            {columns.map((col, index) => (
              <div key={index} className='flex items-center gap-3'>
                <input
                  type="text"
                  className='input-form body-l'
                  placeholder='e.g. Todo'
                  value={col}
                  onChange={e => updateColumn(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeColumn(index)}
                  className='text-medium-grey hover:text-red cursor-pointer shrink-0'
                >
                  <CrossIcon />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addColumn} className='button-secondary'>
            + Add New Column
          </button>
        </div>
        <button className='button-primary-s'>
          {isEditMode ? 'Save Changes' : 'Create New Board'}
        </button>
      </form>
    </Modal>
  );
};

export default NewBoardPanel;
