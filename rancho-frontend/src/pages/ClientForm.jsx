import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const ClientForm = () => {
  const navigate = useNavigate();
  const [familyName, setFamilyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/families`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: familyName }),
      });

      if (response.ok) {
        navigate("/clientes"); // Redireciona de volta para a lista
      } else {
        alert("Erro ao salvar família.");
      }
    } catch (error) {
      console.error(error);
      alert("Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Cadastrar Nova Família
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Família (Ex: Família Silva)
          </label>
          <input
            type="text"
            required
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
            placeholder="Digite o nome..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? "A Guardar..." : "Guardar Família"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
