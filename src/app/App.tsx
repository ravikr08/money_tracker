import './App.css'
import { Outlet, useLocation } from 'react-router-dom'
import SideBar from '@/modules/sidebar/SideBar'
import BottomNav from '@/modules/sidebar/BottomNav'
import Header from '@/shared/components/Header'
function App() {
  // the transactions page has its own green look, the menu and avatar follow it
  const { pathname } = useLocation()
  // phone: header on top, only the page content scrolls, bottom nav below
  // md and up: the whole main area scrolls like before
  return (
    <div className={'flex flex-col md:flex-row h-dvh' + (pathname === '/transactions' ? ' theme-green' : '')}>
      <SideBar />
      <main className='bg-bg w-full min-w-0 flex-1 min-h-0 px-4 pt-4 sm:px-6 md:px-8 md:py-6 lg:py-10 xl:px-[60px] overflow-hidden md:overflow-y-auto flex flex-col gap-4 sm:gap-8 lg:gap-6'>
        <Header />
        <div className="max-w-[1600px] w-full mx-auto flex flex-col flex-1 min-h-0 overflow-y-auto pb-24 md:pb-0 md:flex-none md:overflow-visible">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

export default App
