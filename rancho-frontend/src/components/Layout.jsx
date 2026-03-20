import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Users, PlusCircle, Camera, DollarSign } from "lucide-react";

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Visão Geral", icon: Home },
    { path: "/clientes", label: "Famílias", icon: Users },
    { path: "/clientes/novo", label: "Novo Cadastro", icon: PlusCircle },
    { path: "/renda", label: "Lançar Pagamento", icon: DollarSign },
  ];

  return (
    // MUDANÇA: Fundo geral agora é um bege pedra suave (bg-stone-100)
    <div className="flex h-screen bg-stone-100">
      {/* Sidebar */}
      // MUDANÇA: Sidebar agora é um verde floresta quase preto (bg-emerald-950)
      <aside className="w-64 bg-emerald-950 text-white flex flex-col shadow-xl">
        <div className="p-6 flex items-center gap-3 border-b border-emerald-800/50">
          // MUDANÇA: Ícone e texto do logo com toque dourado (text-amber-400)
          <Camera className="w-9 h-9 text-amber-400" />
          <div flex flex-col>
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
                  // MUDANÇA: Item ativo usa fundo terracota suave (bg-orange-950/40) e borda dourada
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
        <div className="p-4 border-t border-emerald-800/50 text-center text-xs text-stone-500">
          © 2024 Estúdio Rancho dos Sonhos
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
