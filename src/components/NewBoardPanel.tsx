import { useKanban } from '../context/KanbanContext';

const NewBoardPanel = () => {
    
    const { state, dispatch } = useKanban(); 

  if (!state.isNewBoardPanelOpen) return null;


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => dispatch({ type: 'TOGGLE_NEW_BOARD_PANEL' })}>
        <div className="bg-white p-6 rounded-lg w-90 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
          <h2>Add New Board</h2>
          <form className='mt-6 flex flex-col gap-4'>
            <label className='body-m text-medium-grey'>Name</label>
            <input type="text" className='input-form body-l' placeholder='e.g. Web design'/>
            <div>
              <label className='body-m text-medium-grey'>Columns</label>
              <div className='flex items-center gap-3 mt-2 mb-4'>
                <input type="text" className='input-form body-l' placeholder='Todo'/>
                <button className='group text-medium-grey hover:text-red cursor-pointer'>
                  <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fillRule="evenodd"><path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z"/><path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z"/></g></svg>
                </button>
              </div>
              <button className='button-secondary'>+ Add New Column</button>
            </div>
            <button className='button-primary-s'>Create New Board</button>
          </form>
        </div>
    </div>
  )
}

export default NewBoardPanel