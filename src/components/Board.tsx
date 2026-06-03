import { useKanban } from '../context/KanbanContext';

const COLUMN_COLORS = ['#49C4E5', '#8471F2', '#67E2AE', '#F4B550', '#E96E6E'];

const Board = () => {
  const { state } = useKanban();
  const { boards, activeBoardIndex } = state;
  const activeBoard = boards[activeBoardIndex];

  return (
    <section className="h-full bg-light-grey overflow-y-auto">
      {activeBoard.columns.length === 0 ? (
        <div className="flex h-full items-center justify-center flex-col gap-6">
          <h2 className="text-medium-grey">This board is empty. Create a new column to get started.</h2>
          <button className="button-primary-l">+ Add New Column</button>
        </div>
      ) : (
        <div className="flex gap-6 p-6 h-full overflow-x-auto">
          {activeBoard.columns.map((column, index) => (
            <div key={column.name} className="flex flex-col gap-4 w-70 shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLUMN_COLORS[index % COLUMN_COLORS.length] }} />
                <p className="heading-s">{column.name.toUpperCase()} ({column.tasks.length})</p>
              </div>
              <div className="flex flex-col gap-4">
                {column.tasks.map(task => (
                  <div key={task.title} className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="heading-m text-black">{task.title}</h3>
                    <p className="body-m text-medium-grey mt-2">
                      {task.subtasks.filter(s => s.isCompleted).length} of {task.subtasks.length} subtasks
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-4 shrink-0">
            <div className="invisible heading-s">placeholder</div>
            <button className='flex-1 bg-lines-light heading-m text-medium-grey rounded-md px-8 flex items-center gap-1 cursor-pointer'>
              + New Column
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Board