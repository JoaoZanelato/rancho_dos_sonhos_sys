import React, { useState, useEffect } from "react";
import { DollarSign, Save, Loader2, CheckCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const Incomes = () => {
  const [families, setFamilies] = useState([]);
  const [loadingFamilies, setLoadingFamilies] = useState(true);

  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await fetch(`${API_URL}/families`);
        if (response.ok) {
          const data = await response.json();
          const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
          setFamilies(sorted);
        }
      } catch (err) {
        console.error("Erro ao buscar famílias:", err);
      } finally {
        setLoadingFamilies(false);
      }
    };
    fetchFamilies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    const numericAmount = amount.replace(",", ".");

    try {
      const response = await fetch(
        `${API_URL}/families/${selectedFamilyId}/incomes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description,
            amount: numericAmount,
          }),
        },
      );

      if (response.ok) {
        setSuccessMessage("Renda registada com sucesso!");
        setDescription("");
        setAmount("");
        setSelectedFamilyId("");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const errData = await response.json();
        alert(errData.error || "Erro ao registar renda.");
      }
    } catch (error) {
      console.error(error);
      alert("Falha na comunicação com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Registar Pagamento
          </h1>
          <p className="text-sm text-gray-500">
            Adicione uma nova entrada de renda ao caixa.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      {loadingFamilies ? (
        <div className="flex justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Família / Cliente <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={selectedFamilyId}
              onChange={(e) => setSelectedFamilyId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white outline-none"
            >
              <option value="" disabled>
                Selecione um cliente...
              </option>
              {families.map((family) => (
                <option key={family.id} value={family.id}>
                  {family.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Sinal, Ensaio Newborn"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor (R$) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={amount}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9,]/g, "");
                  setAmount(val);
                }}
                placeholder="Ex: 1500,00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting || !selectedFamilyId}
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors font-medium"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSubmitting ? "A Registar..." : "Registar Renda"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Incomes;
