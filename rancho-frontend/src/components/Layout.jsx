import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Users, PlusCircle, Camera } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/clientes', label: 'Clientes', icon: Users },
    { path: '/clientes/novo', label: 'Novo Cliente', icon: PlusCircle },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-emerald-800">
          <Camera className="w-8 h-8 text-emerald-300" />
          <h1 className="text-xl font-bold tracking-tight">Rancho dos Sonhos</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-800/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;