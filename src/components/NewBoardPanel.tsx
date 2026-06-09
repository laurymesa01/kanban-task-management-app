import { useKanban } from '../context/KanbanContext';
import Modal from './Modal';
import { CrossIcon } from './icons';

const NewBoardPanel = () => {
  const { state, dispatch } = useKanban();

  if (!state.isNewBoardPanelOpen) return null;

  return (
    <Modal onClose={() => dispatch({ type: 'TOGGLE_NEW_BOARD_PANEL' })} className="w-90 max-h-[90vh] p-6">
      <h2>Add New Board</h2>
      <form className='mt-6 flex flex-col gap-4'>
        <label className='body-m text-medium-grey dark:text-white'>Name</label>
        <input type="text" className='input-form body-l' placeholder='e.g. Web design'/>
        <div>
          <label className='body-m text-medium-grey dark:text-white'>Columns</label>
          <div className='flex items-center gap-3 mt-2 mb-4'>
            <input type="text" className='input-form body-l' placeholder='Todo'/>
            <button type="button" className='text-medium-grey hover:text-red cursor-pointer'>
              <CrossIcon />
            </button>
          </div>
          <button type="button" className='button-secondary'>+ Add New Column</button>
        </div>
        <button className='button-primary-s'>Create New Board</button>
      </form>
    </Modal>
  );
};

export default NewBoardPanel;
