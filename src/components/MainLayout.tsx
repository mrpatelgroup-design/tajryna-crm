import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppStore } from '../lib/store';

export default function MainLayout() {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-linear ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-0'
        }`}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
