const Header = () => {
  return (
    <header className="h-(--header-height) px-4 flex items-center justify-between border-b border-lines-light dark:border-lines-dark">
      <div className="flex items-center gap-30">
        <h1>Platform Launch</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="button-primary-l">
          <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFF" d="M7.368 12V7.344H12V4.632H7.368V0H4.656v4.632H0v2.712h4.656V12z"/>
          </svg> 
          Add new task
        </button>
        <button>
          <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg">
            <g fill="#828FA3" fillRule="evenodd"><circle cx="2.308" cy="2.308" r="2.308"/><circle cx="2.308" cy="10" r="2.308"/><circle cx="2.308" cy="17.692" r="2.308"/></g>
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header