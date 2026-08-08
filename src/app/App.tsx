import './App.css'
import { Outlet } from 'react-router-dom'
import SideBar from '@/modules/sidebar/SideBar'
import Header from '@/shared/components/Header'
function App() {
  return (
    <div className='flex h-screen'>
      <SideBar />
      <main className='bg-bg w-full px-8 py-6 overflow-y-auto flex flex-col gap-15'>
        <Header />
        <Outlet />
      </main>
    </div>
  )
}

export default App
