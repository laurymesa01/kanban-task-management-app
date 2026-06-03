const Board = () => {
  return (
    <section className="h-full bg-light-grey flex items-center justify-center flex-col gap-6">
        <h2 className="text-medium-grey">This board is empty. Create a new column to get started.</h2>
        <button className="button-primary-l">+ Add New Column</button>
    </section>
  )
}

export default Board