import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowUpDown,
  Users as UsersIcon,
  DollarSign,
  Loader2,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const roleMap = {
  FATHER: { label: "Pai", color: "bg-blue-100 text-blue-800" },
  MOTHER: { label: "Mãe", color: "bg-pink-100 text-pink-800" },
  BABY: { label: "Bebê", color: "bg-purple-100 text-purple-800" },
  SIBLING: { label: "Irmão(ã)", color: "bg-green-100 text-green-800" },
  OTHER: { label: "Outro", color: "bg-gray-100 text-gray-800" },
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const Clients = () => {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchFamilies = async () => {
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
    };
    fetchFamilies();
  }, []);

  const sortedFamilies = useMemo(() => {
    return [...families].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [families, sortOrder]);

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Famílias Cadastradas
        </h1>
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortOrder === "asc" ? "A-Z" : "Z-A"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedFamilies.map((family) => (
          <div
            key={family.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-5 border-b bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                {family.name}
              </h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex flex-wrap gap-2">
                {family.members?.map((m) => (
                  <span
                    key={m.id}
                    className={`px-2 py-1 text-xs font-medium rounded-md ${roleMap[m.role]?.color || roleMap.OTHER.color}`}
                  >
                    {m.name} ({roleMap[m.role]?.label || "Outro"})
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <span className="text-sm text-gray-600 font-medium">
                Total Gerado:
              </span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(family.totalIncome || 0)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;
