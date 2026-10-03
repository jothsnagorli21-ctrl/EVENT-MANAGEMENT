import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toast from './Toast';

export default function DashboardLayout({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="page-content">
          {children}
        </main>
      </div>
      <Toast />
    </div>
  );
}
