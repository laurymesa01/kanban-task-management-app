import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const Layout = () => {
  return (
    <div className='flex h-screen'>
        <Sidebar/>
        <div className='flex flex-col flex-1'>
            <Header/>
        </div>
    </div>
  )
}

export default Layout