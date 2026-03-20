import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpDown,
  Users as UsersIcon,
  DollarSign,
  Loader2,
  Search,
  ReceiptText,
  PlusCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// MUDANÇA: Cores dos badges ligeiramente mais dessaturadas para combinar com o rústico
const roleMap = {
  FATHER: {
    label: "Pai",
    color: "bg-blue-100 text-blue-900 border border-blue-200",
  },
  MOTHER: {
    label: "Mãe",
    color: "bg-pink-100 text-pink-900 border border-pink-200",
  },
  BABY: {
    label: "Bebê",
    color: "bg-purple-100 text-purple-900 border border-purple-200",
  },
  SIBLING: {
    label: "Irmão(ã)",
    color: "bg-amber-100 text-amber-900 border border-amber-200",
  },
  OTHER: {
    label: "Outro",
    color: "bg-stone-100 text-stone-800 border border-stone-200",
  },
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(dateString));
};

const Clients = () => {
  const navigate = useNavigate();
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFamilies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/families`);
      if (response.ok) {
        const data = await response.json();
        setFamilies(data);
      }
    } catch (err) {
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFamilies();
  }, [fetchFamilies]);

  const filteredAndSortedFamilies = useMemo(() => {
    const filtered = families.filter((family) => {
      const normalizedFamilyName = family.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      const normalizedSearchTerm = searchTerm
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      return normalizedFamilyName.includes(normalizedSearchTerm);
    });

    return filtered.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [families, sortOrder, searchTerm]);

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Famílias & Clientes
        </h1>
        {/* MUDANÇA: Botão principal agora é Terracota (bg-orange-700) */}
        <button
          onClick={() => navigate("/clientes/novo")}
          className="flex items-center gap-2 bg-orange-700 text-white px-5 py-2.5 rounded-xl hover:bg-orange-800 transition-colors shadow-sm font-medium"
        >
          <PlusCircle className="w-5 h-5" />
          Novo Cadastro
        </button>
      </div>
      // MUDANÇA: Fundo da barra de ferramentas bege (bg-stone-50) e borda suave
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Pesquisar família pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // MUDANÇA: Foco agora é laranja (focus:ring-orange-500)
            className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all bg-white"
          />
        </div>

        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="flex items-center justify-center gap-2 bg-stone-100 border border-stone-300 px-4 py-2.5 rounded-lg hover:bg-stone-200 transition-colors whitespace-nowrap text-stone-800 font-medium"
        >
          <ArrowUpDown className="w-4 h-4 text-stone-500" />
          {sortOrder === "asc" ? "Ordem: A-Z" : "Ordem: Z-A"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedFamilies.length > 0 ? (
          filteredAndSortedFamilies.map((family) => (
            // MUDANÇA: Borda do card mais suave (border-stone-200)
            <div
              key={family.id}
              className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              // MUDANÇA: Cabeçalho do card bege terroso (bg-stone-100)
              <div className="p-5 border-b border-stone-200 bg-stone-100/50 flex-none">
                <h2 className="text-xl font-bold text-gray-950 truncate">
                  {family.name}
                </h2>
              </div>
              <div className="p-6 space-y-5 flex-1 bg-white">
                {/* Membros */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-stone-600">
                    // MUDANÇA: Ícone verde mata (text-emerald-600)
                    <UsersIcon className="w-4 h-4 text-emerald-600" />
                    Membros da Família:
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {family.members?.length > 0 ? (
                      family.members.map((m) => (
                        <span
                          key={m.id}
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${roleMap[m.role]?.color || roleMap.OTHER.color}`}
                        >
                          {m.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-stone-400 italic">
                        Nenhum membro registado.
                      </span>
                    )}
                  </div>
                </div>

                {/* Histórico de Rendas */}
                <div className="pt-5 border-t border-stone-100 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-stone-600">
                    <ReceiptText className="w-4 h-4 text-amber-600" />
                    Histórico de Pagamentos:
                  </div>

                  {family.incomes && family.incomes.length > 0 ? (
                    <ul className="space-y-2.5 max-h-32 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-200">
                      {family.incomes.map((income) => (
                        <li
                          key={income.id}
                          className="flex justify-between items-center text-sm bg-stone-50 p-3 rounded-lg border border-stone-100"
                        >
                          <div>
                            <p className="text-gray-900 font-semibold">
                              {income.description}
                            </p>
                            <p className="text-xs text-stone-500">
                              {formatDate(income.date)}
                            </p>
                          </div>
                          <span className="text-base font-bold text-gray-950">
                            {formatCurrency(income.amount)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-stone-400 italic bg-stone-50 p-3 rounded-lg text-center">
                      Nenhum pagamento registado.
                    </p>
                  )}
                </div>
              </div>
              {/* MUDANÇA: Totalizador no Rodapé Laranja Terracota suave (bg-orange-50) */}
              <div className="p-5 bg-orange-50 border-t border-orange-100 flex justify-between items-center flex-none">
                <span className="text-sm text-orange-950 font-bold uppercase tracking-wider">
                  Total Investido:
                </span>
                <span className="text-2xl font-extrabold text-orange-950">
                  {formatCurrency(family.totalIncome || 0)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border-2 border-stone-200 border-dashed m-2">
            <Search className="w-14 h-14 text-stone-300 mx-auto mb-4" />
            <p className="text-lg text-stone-600 font-semibold">
              Ué, cadê todo mundo?
            </p>
            <p className="text-stone-500 mt-1">
              Nenhuma família encontrada com o nome "
              <strong className="text-orange-700">{searchTerm}</strong>".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
