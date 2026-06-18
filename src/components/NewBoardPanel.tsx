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
  const [nameError, setNameError] = useState<string | null>(null);
  const [columnDupErrors, setColumnDupErrors] = useState<boolean[]>([]);

  const clearColumnDupErrors = () => setColumnDupErrors([]);

  const handleClose = () =>
    dispatch({ type: isEditMode ? 'TOGGLE_EDIT_BOARD_PANEL' : 'TOGGLE_NEW_BOARD_PANEL' });

  const handleSubmit = () => {
    const trimmedName = boardName.trim();
    const isListValid = columnList.validate();

    let nameErr: string | null = null;
    if (!trimmedName) {
      nameErr = "Can't be empty";
    } else {
      const isDuplicate = isEditMode
        ? state.boards.some((b, i) => i !== state.activeBoardIndex && b.name === trimmedName)
        : state.boards.some(b => b.name === trimmedName);
      if (isDuplicate) nameErr = 'Already exists';
    }
    setNameError(nameErr);

    const trimmedCols = columnList.items.map(c => c.trim().toLowerCase());
    const dupErrors = columnList.items.map((_, i) =>
      trimmedCols[i] !== '' && trimmedCols.indexOf(trimmedCols[i]) !== i
    );
    setColumnDupErrors(dupErrors);
    const hasDupCols = dupErrors.some(Boolean);

    if (nameErr || !isListValid || hasDupCols) return;

    dispatch({
      type: isEditMode ? 'EDIT_BOARD' : 'ADD_BOARD',
      payload: {
        name: trimmedName,
        columns: columnList.items.map(col => ({ name: col.trim(), tasks: [] })),
      },
    });
  };

  return (
    <Modal onClose={handleClose} aria-labelledby="new-board-heading" className="w-[90vw] md:w-90 max-h-[90vh] p-6 overflow-y-auto">
      <h2 id="new-board-heading">{isEditMode ? 'Edit Board' : 'Add New Board'}</h2>
      <form className='mt-6 flex flex-col gap-4' onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <label htmlFor="board-name" className='body-m text-medium-grey dark:text-white'>Name</label>
        <div className='relative'>
          <input
            id="board-name"
            type="text"
            className={`input-form body-l ${nameError ? 'border-red' : ''}`}
            placeholder='e.g. Web design'
            value={boardName}
            aria-invalid={!!nameError}
            aria-describedby={nameError ? 'board-name-error' : undefined}
            onChange={e => { setBoardName(e.target.value); if (e.target.value.trim()) setNameError(null); }}
          />
          {nameError && (
            <span id="board-name-error" role="alert" className='absolute right-3 top-1/2 -translate-y-1/2 body-l text-red'>{nameError}</span>
          )}
        </div>

        <div>
          <p id="columns-label" className='body-m text-medium-grey dark:text-white'>Columns</p>
          <div role="list" aria-labelledby="columns-label" className='flex flex-col gap-3 mt-2 mb-4'>
            {columnList.items.map((col, index) => (
              <div key={index} role="listitem" className='flex items-center gap-3'>
                <div className='relative flex-1'>
                  <input
                    type="text"
                    className={`input-form body-l ${columnList.errors[index] || columnDupErrors[index] ? 'border-red' : ''}`}
                    placeholder='e.g. Todo'
                    value={col}
                    aria-label={`Column ${index + 1}`}
                    aria-invalid={columnList.errors[index] || !!columnDupErrors[index]}
                    aria-describedby={(columnList.errors[index] || columnDupErrors[index]) ? `column-error-${index}` : undefined}
                    onChange={e => { columnList.update(index, e.target.value); clearColumnDupErrors(); }}
                  />
                  {(columnList.errors[index] || columnDupErrors[index]) && (
                    <span id={`column-error-${index}`} role="alert" className='absolute right-3 top-1/2 -translate-y-1/2 body-l text-red'>
                      {columnList.errors[index] ? "Can't be empty" : 'Already exists'}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { columnList.remove(index); clearColumnDupErrors(); }}
                  className='text-medium-grey hover:text-red cursor-pointer shrink-0'
                  aria-label={`Remove column ${index + 1}${col ? `: ${col}` : ''}`}
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
