import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, PlusCircle, Camera, LogOut } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("rancho_token");
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Visão Geral", icon: Home },
    { path: "/clientes", label: "Famílias", icon: Users },
    { path: "/clientes/novo", label: "Novo Cadastro", icon: PlusCircle },
  ];

  return (
    <div className="flex h-screen bg-stone-100">
      <aside className="w-64 bg-emerald-950 text-white flex flex-col shadow-xl">
        <div className="p-6 flex items-center gap-3 border-b border-emerald-800/50">
          <Camera className="w-9 h-9 text-amber-400" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Rancho
            </h1>
            <p className="text-xs text-amber-200/80 -mt-1">dos Sonhos</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-orange-950/40 text-amber-300 font-semibold shadow-inner border-l-4 border-amber-400 -ml-1 pl-3"
                    : "text-stone-200 hover:bg-emerald-900 hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-amber-400" : "text-stone-400"}`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-emerald-800/50">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-sm text-stone-400 hover:text-white hover:bg-emerald-900 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
