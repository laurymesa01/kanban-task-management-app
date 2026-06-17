import { useState } from 'react';
import { useKanban } from '../context/KanbanContext';
import { useEditableList } from '../hooks/useEditableList';
import Modal from './Modal';
import { CrossIcon } from './icons';

const NewBoardPanel = () => {
  const { state, dispatch } = useKanban();
  const isEditMode = state.isEditBoardPanelOpen;
  const activeBoard = state.boards[state.activeBoardIndex];

  const [boardName, setBoardName] = useState(isEditMode ? activeBoard.name : '');
  const columnList = useEditableList(
    isEditMode ? activeBoard.columns.map(col => col.name) : ['Todo', 'Doing']
  );
  const [nameError, setNameError] = useState(false);

  const handleClose = () =>
    dispatch({ type: isEditMode ? 'TOGGLE_EDIT_BOARD_PANEL' : 'TOGGLE_NEW_BOARD_PANEL' });

  const handleSubmit = () => {
    const isNameValid = !!boardName.trim();
    const isListValid = columnList.validate();
    setNameError(!isNameValid);
    if (!isNameValid || !isListValid) return;

    dispatch({
      type: isEditMode ? 'EDIT_BOARD' : 'ADD_BOARD',
      payload: {
        name: boardName.trim(),
        columns: columnList.items.map(col => ({ name: col.trim(), tasks: [] })),
      },
    });
  };

  return (
    <Modal onClose={handleClose} className="w-[90vw] md:w-90 max-h-[90vh] p-6 overflow-y-auto">
      <h2>{isEditMode ? 'Edit Board' : 'Add New Board'}</h2>
      <form className='mt-6 flex flex-col gap-4' onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <label className='body-m text-medium-grey dark:text-white'>Name</label>
        <div className='relative'>
          <input
            type="text"
            className={`input-form body-l ${nameError ? 'border-red' : ''}`}
            placeholder='e.g. Web design'
            value={boardName}
            onChange={e => { setBoardName(e.target.value); if (e.target.value.trim()) setNameError(false); }}
          />
          {nameError && (
            <span className='absolute right-3 top-1/2 -translate-y-1/2 body-l text-red'>Can't be empty</span>
          )}
        </div>
        <div>
          <label className='body-m text-medium-grey dark:text-white'>Columns</label>
          <div className='flex flex-col gap-3 mt-2 mb-4'>
            {columnList.items.map((col, index) => (
              <div key={index} className='flex items-center gap-3'>
                <div className='relative flex-1'>
                  <input
                    type="text"
                    className={`input-form body-l ${columnList.errors[index] ? 'border-red' : ''}`}
                    placeholder='e.g. Todo'
                    value={col}
                    onChange={e => columnList.update(index, e.target.value)}
                  />
                  {columnList.errors[index] && (
                    <span className='absolute right-3 top-1/2 -translate-y-1/2 body-l text-red'>Can't be empty</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => columnList.remove(index)}
                  className='text-medium-grey hover:text-red cursor-pointer shrink-0'
                >
                  <CrossIcon />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={columnList.add} className='button-secondary'>
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
