import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Plus, Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const ClientForm = () => {
  const navigate = useNavigate();
  const [familyName, setFamilyName] = useState("");
  // Novo estado: Lista dinâmica de membros
  const [members, setMembers] = useState([]); 
  const [loading, setLoading] = useState(false);

  // Função para adicionar um membro vazio à lista
  const handleAddMember = () => {
    setMembers([...members, { name: "", role: "OTHER" }]);
  };

  // Função para atualizar os dados de um membro específico
  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  // Função para remover um membro da lista
  const handleRemoveMember = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/families`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Agora enviamos o nome da família E a lista de membros
        body: JSON.stringify({ 
          name: familyName,
          members: members.filter(m => m.name.trim() !== "") // Filtra membros com nome vazio por segurança
        }),
      });

      if (response.ok) {
        navigate("/clientes"); 
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
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Cadastrar Nova Família
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sessão da Família */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Família <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
            placeholder="Ex: Família Silva"
          />
        </div>

        {/* Sessão de Membros */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Membros da Família</h2>
            <button
              type="button"
              onClick={handleAddMember}
              className="flex items-center gap-1 text-sm bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-md hover:bg-emerald-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Adicionar Membro
            </button>
          </div>

          {members.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Nenhum membro adicionado. Adicione pais, mães ou bebês.</p>
          ) : (
            <div className="space-y-3">
              {members.map((member, index) => (
                <div key={index} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="Nome do membro..."
                    />
                  </div>
                  <div className="w-1/3">
                    <select
                      value={member.role}
                      onChange={(e) => handleMemberChange(index, "role", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    >
                      <option value="FATHER">Pai</option>
                      <option value="MOTHER">Mãe</option>
                      <option value="BABY">Bebê</option>
                      <option value="SIBLING">Irmão(ã)</option>
                      <option value="OTHER">Outro</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Remover membro"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors font-medium"
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