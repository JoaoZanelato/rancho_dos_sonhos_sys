import React, { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  Loader2,
  Calendar,
  TrendingUp,
  ReceiptText,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFamilies: 0,
    totalIncome: 0,
    monthlyIncome: 0,
    averageTicket: 0,
    recentIncomes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("rancho_token");
        const response = await fetch(`${API_URL}/families`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          const allIncomes = data.flatMap((family) =>
            (family.incomes || []).map((income) => ({
              ...income,
              familyName: family.name,
            })),
          );
          const sortedIncomes = allIncomes.sort(
            (a, b) => new Date(b.date) - new Date(a.date),
          );

          const totalFamilies = data.length;
          const totalIncome = data.reduce(
            (sum, family) => sum + (Number(family.totalIncome) || 0),
            0,
          );

          const monthlyIncome = sortedIncomes
            .filter((inc) => {
              const incDate = new Date(inc.date);
              return (
                incDate.getMonth() === currentMonth &&
                incDate.getFullYear() === currentYear
              );
            })
            .reduce((sum, inc) => sum + Number(inc.amount), 0);

          const averageTicket =
            totalFamilies > 0 ? totalIncome / totalFamilies : 0;

          setStats({
            totalFamilies,
            totalIncome,
            monthlyIncome,
            averageTicket,
            recentIncomes: sortedIncomes.slice(0, 5),
          });
        }
      } catch (error) {
        console.error("Erro ao procurar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Bem-vinda, Vanessa
        </h1>
        <p className="text-gray-600 mt-1.5">
          Aqui está o pulso financeiro do Rancho dos Sonhos hoje.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-7 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-5 relative overflow-hidden group hover:border-orange-200 transition-colors">
          <div className="absolute -right-6 -top-6 text-orange-100 opacity-40 group-hover:scale-110 transition-transform duration-300">
            <Calendar className="w-28 h-28" />
          </div>
          <div className="p-4 bg-orange-100 text-orange-700 rounded-xl relative z-10 shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
          <div className="relative z-10 flex-1 min-w-0">
            <p className="text-sm text-stone-500 font-medium truncate">
              Faturação Deste Mês
            </p>
            <p className="text-2xl font-extrabold text-gray-950 truncate">
              {formatCurrency(stats.monthlyIncome)}
            </p>
          </div>
        </div>

        <div className="bg-white p-7 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-5 hover:border-amber-200 transition-colors">
          <div className="p-4 bg-amber-100 text-amber-700 rounded-xl shrink-0">
            <DollarSign className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-stone-500 font-medium truncate">
              Total Acumulado
            </p>
            <p className="text-2xl font-extrabold text-gray-950 truncate">
              {formatCurrency(stats.totalIncome)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-7 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-5 hover:border-emerald-200 transition-colors">
          <div className="p-4 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-stone-500 font-medium truncate">
              Média por Contrato
            </p>
            <p className="text-2xl font-extrabold text-gray-950 truncate">
              {formatCurrency(stats.averageTicket)}
            </p>
          </div>
        </div>

        <div className="bg-white p-7 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-5 hover:border-yellow-300 transition-colors">
          <div className="p-4 bg-yellow-950 text-yellow-100 rounded-xl shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-stone-500 font-medium truncate">
              Famílias Felizes Atendidas
            </p>
            <p className="text-2xl font-extrabold text-gray-950 truncate">
              {stats.totalFamilies}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <ReceiptText className="w-5 h-5 text-stone-500" />
            <h2 className="text-lg font-bold text-gray-800">
              Fluxo de Caixa Recente
            </h2>
          </div>
        </div>
        <div className="p-0">
          {stats.recentIncomes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-stone-100 text-stone-600 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Cliente / Família</th>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {stats.recentIncomes.map((income) => (
                    <tr
                      key={income.id}
                      className="hover:bg-orange-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-stone-600">
                        {formatDate(income.date)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-950">
                        {income.familyName}
                      </td>
                      <td className="px-6 py-4 text-stone-800">
                        {income.description}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-700 text-base">
                        {formatCurrency(income.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-stone-500 bg-stone-50">
              <p>Nenhum pagamento registado ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
