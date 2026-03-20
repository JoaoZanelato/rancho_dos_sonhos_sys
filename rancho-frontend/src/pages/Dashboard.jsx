import React from "react";
import { Users, DollarSign, Calendar } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Visão Geral</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-lg">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Total de Famílias
            </p>
            <p className="text-2xl font-bold text-gray-900">Gerir no menu</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-4 bg-amber-100 text-amber-600 rounded-lg">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Renda Total</p>
            <p className="text-2xl font-bold text-gray-900">Ver clientes</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-lg">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Próximos Ensaios
            </p>
            <p className="text-2xl font-bold text-gray-900">Em breve</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
