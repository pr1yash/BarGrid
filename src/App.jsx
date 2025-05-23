import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import './App.css';

export default function App() {
  return (
    <div className="app-layout">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <main className="main-content">
        <div className="main-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}