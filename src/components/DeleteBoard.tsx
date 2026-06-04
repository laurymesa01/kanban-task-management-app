const DeleteBoard = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-90 max-h-[90vh] flex flex-col" >
            <h2 className="text-red">Delete this board?</h2>
            <p className='body-l text-medium-grey mt-4'>Are you sure you want to delete the ‘Platform Launch’ board? This action will remove all columns and tasks and cannot be reversed.</p>
            <div className='flex items-center gap-3 mt-6'>
                <button className='button-destructive'>Delete</button>
                <button className='button-secondary'>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default DeleteBoard