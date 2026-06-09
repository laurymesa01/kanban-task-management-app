import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';
import Modal from './Modal';
import { CrossIcon } from './icons';

const NewBoardPanel = () => {
  const { state, dispatch } = useKanban();
  const [boardName, setBoardName] = useState('');
  const [columns, setColumns] = useState(['Todo', 'Doing']);

  if (!state.isNewBoardPanelOpen) return null;

  const addColumn = () => setColumns(prev => [...prev, '']);

  const updateColumn = (index: number, value: string) =>
    setColumns(prev => prev.map((col, i) => (i === index ? value : col)));

  const removeColumn = (index: number) =>
    setColumns(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if (!boardName.trim()) return;
    dispatch({
      type: 'ADD_BOARD',
      payload: {
        name: boardName.trim(),
        columns: columns
          .filter(col => col.trim())
          .map(col => ({ name: col.trim(), tasks: [] })),
      },
    });
  };

  return (
    <Modal onClose={() => dispatch({ type: 'TOGGLE_NEW_BOARD_PANEL' })} className="w-90 max-h-[90vh] p-6">
      <h2>Add New Board</h2>
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
        <button className='button-primary-s'>Create New Board</button>
      </form>
    </Modal>
  );
};

export default NewBoardPanel;
