const NewTaskPanel = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-120 max-h-[90vh] flex flex-col">
        <h2>Add New Task</h2>
        <form>
          <label>Title</label>
          <input type="text" />
          <label>Description</label>
          <textarea name="" id="" rows={7}></textarea>
          <div>
            <label>Subtasks</label>
            <div>
              <input type="text" />
              <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg"><g fill="#828FA3" fillRule="evenodd"><path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z"/><path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z"/></g></svg>
            </div>
            <button>+ Add New Subtask</button>
          </div>
          <label>Status</label>
          <select name="" id="">
            <option value="Todo">Todo</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
          </select>
        </form>
      </div>
    </div>
  )
}

export default NewTaskPanel;