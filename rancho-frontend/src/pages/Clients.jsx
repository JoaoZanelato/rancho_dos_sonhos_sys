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
  MoreVertical,
  X,
  Save,
  Edit2,
  Trash2,
  AlertTriangle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
const formatDate = (dateString) =>
  dateString
    ? new Intl.DateTimeFormat("pt-BR").format(new Date(dateString))
    : "";

const Clients = () => {
  const navigate = useNavigate();
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [editFamilyName, setEditFamilyName] = useState("");

  const fetchFamilies = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const token = localStorage.getItem("rancho_token");
      const response = await fetch(`${API_URL}/families`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFamilies(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFamilies();
  }, [fetchFamilies]);

  const filteredAndSortedFamilies = useMemo(() => {
    const filtered = families.filter((family) =>
      family.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(
          searchTerm
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase(),
        ),
    );
    return filtered.sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    );
  }, [families, sortOrder, searchTerm]);

  const openModal = (type, family) => {
    setSelectedFamily(family);
    setModalType(type);
    setOpenDropdownId(null);
    if (type === "edit") setEditFamilyName(family.name);
  };
  const closeModal = () => {
    setModalType(null);
    setSelectedFamily(null);
    setIncomeDescription("");
    setIncomeAmount("");
    setEditFamilyName("");
  };

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("rancho_token")}`,
  });

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${API_URL}/families/${selectedFamily.id}/incomes`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            description: incomeDescription,
            amount: incomeAmount.replace(",", "."),
          }),
        },
      );
      if (res.ok) {
        closeModal();
        fetchFamilies(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/families/${selectedFamily.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ name: editFamilyName }),
      });
      if (res.ok) {
        closeModal();
        fetchFamilies(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFamily = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/families/${selectedFamily.id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        closeModal();
        fetchFamilies(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm("Pretende mesmo excluir este membro?")) return;
    try {
      const res = await fetch(`${API_URL}/members/${memberId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        setSelectedFamily((prev) => ({
          ...prev,
          members: prev.members.filter((m) => m.id !== memberId),
        }));
        fetchFamilies(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Famílias & Clientes
        </h1>
        <button
          onClick={() => navigate("/clientes/novo")}
          className="flex items-center gap-2 bg-orange-700 text-white px-5 py-2.5 rounded-xl hover:bg-orange-800 shadow-sm font-medium"
        >
          <PlusCircle className="w-5 h-5" /> Novo Cadastro
        </button>
      </div>

      <div className="flex gap-4 bg-white p-5 rounded-2xl shadow-sm border border-stone-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="flex items-center gap-2 bg-stone-100 border border-stone-300 px-4 py-2.5 rounded-lg hover:bg-stone-200 text-stone-800 font-medium"
        >
          <ArrowUpDown className="w-4 h-4 text-stone-500" />{" "}
          {sortOrder === "asc" ? "A-Z" : "Z-A"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedFamilies.length > 0 ? (
          filteredAndSortedFamilies.map((family) => (
            <div
              key={family.id}
              className="bg-white rounded-2xl shadow-sm border border-stone-200 flex flex-col relative"
            >
              <div className="p-5 border-b border-stone-200 bg-stone-100/50 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-950 truncate">
                  {family.name}
                </h2>
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === family.id ? null : family.id,
                      )
                    }
                    className="p-1.5 text-stone-400 hover:text-orange-700 hover:bg-orange-100/50 rounded-md"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {openDropdownId === family.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenDropdownId(null)}
                      ></div>
                      <div className="absolute right-0 top-10 w-48 bg-white border border-stone-200 rounded-xl shadow-lg z-20 py-1">
                        <button
                          onClick={() => openModal("payment", family)}
                          className="w-full text-left px-4 py-2.5 hover:bg-stone-50 flex gap-3 text-sm text-stone-700 font-medium border-b border-stone-100"
                        >
                          <DollarSign className="w-4 h-4 text-emerald-600" />{" "}
                          Lançar Pagamento
                        </button>
                        <button
                          onClick={() => openModal("edit", family)}
                          className="w-full text-left px-4 py-2.5 hover:bg-stone-50 flex gap-3 text-sm text-stone-700 font-medium border-b border-stone-100"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" /> Editar
                          Família
                        </button>
                        <button
                          onClick={() => openModal("delete", family)}
                          className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex gap-3 text-sm text-red-600 font-medium"
                        >
                          <Trash2 className="w-4 h-4" /> Excluir Família
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="p-6 space-y-5 flex-1 bg-white">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-stone-600">
                    <UsersIcon className="w-4 h-4 text-emerald-600" /> Membros:
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {family.members?.map((m) => (
                      <span
                        key={m.id}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${roleMap[m.role]?.color || roleMap.OTHER.color}`}
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-5 border-t border-stone-100 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-stone-600">
                    <ReceiptText className="w-4 h-4 text-amber-600" />{" "}
                    Histórico:
                  </div>
                  <ul className="space-y-2.5 max-h-32 overflow-y-auto">
                    {family.incomes?.map((income) => (
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
                </div>
              </div>
              <div className="p-5 bg-orange-50 border-t border-orange-100 flex justify-between rounded-b-2xl">
                <span className="text-sm font-bold uppercase">Total:</span>
                <span className="text-2xl font-extrabold">
                  {formatCurrency(family.totalIncome || 0)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border-2 border-stone-200 border-dashed m-2">
            Sem resultados.
          </div>
        )}
      </div>

      {modalType === "payment" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between p-5 border-b border-stone-100 bg-stone-50">
              <h3 className="text-lg font-bold flex gap-2">
                <DollarSign className="text-orange-600" /> Lançar Pagamento
              </h3>
              <button onClick={closeModal}>
                <X />
              </button>
            </div>
            <form onSubmit={handleIncomeSubmit} className="p-6 space-y-5">
              <input
                required
                value={incomeDescription}
                onChange={(e) => setIncomeDescription(e.target.value)}
                placeholder="Descrição"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <input
                required
                value={incomeAmount}
                onChange={(e) =>
                  setIncomeAmount(e.target.value.replace(/[^0-9,]/g, ""))
                }
                placeholder="Valor"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-stone-100 py-3 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-700 text-white rounded-xl font-semibold"
                >
                  Registar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalType === "edit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between p-5 border-b border-stone-100 bg-stone-50">
              <h3 className="text-lg font-bold flex gap-2">
                <Edit2 className="text-blue-600" /> Editar Família
              </h3>
              <button onClick={closeModal}>
                <X />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <input
                required
                value={editFamilyName}
                onChange={(e) => setEditFamilyName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="bg-stone-50 rounded-xl p-2 space-y-2 max-h-40 overflow-y-auto">
                {selectedFamily?.members.map((m) => (
                  <div
                    key={m.id}
                    className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-bold">{m.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteMember(m.id)}
                      className="p-2 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-stone-100 py-3 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white rounded-xl font-semibold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalType === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-8 text-center space-y-4">
            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto" />
            <h3 className="text-xl font-bold">Excluir Família?</h3>
            <div className="flex gap-3 pt-4">
              <button
                onClick={closeModal}
                className="flex-1 border py-3 rounded-xl font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteFamily}
                className="flex-1 bg-red-600 text-white rounded-xl font-semibold"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
