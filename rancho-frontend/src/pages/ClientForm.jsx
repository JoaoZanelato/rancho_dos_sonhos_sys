import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Plus, Trash2, Save, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const roles = [
  { value: "FATHER", label: "Pai" },
  { value: "MOTHER", label: "Mãe" },
  { value: "BABY", label: "Bebê" },
  { value: "SIBLING", label: "Irmão(ã)" },
  { value: "OTHER", label: "Outro" },
];

const ClientForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [members, setMembers] = useState([{ name: "", role: "FATHER" }]);

  const addMemberField = () =>
    setMembers([...members, { name: "", role: "BABY" }]);
  const removeMemberField = (index) =>
    setMembers(members.filter((_, i) => i !== index));
  const updateMember = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validMembers = members.filter((m) => m.name.trim() !== "");
      const familyData = { name: familyName, members: validMembers };

      const token = localStorage.getItem("rancho_token"); // O bilhete!

      const response = await fetch(`${API_URL}/families`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Mostrando o bilhete
        },
        body: JSON.stringify(familyData),
      });

      if (response.ok) navigate("/clientes");
      else alert("Erro ao salvar família");
    } catch (error) {
      console.error(error);
      alert("Falha na comunicação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
      <div className="flex items-center gap-4 mb-8 border-b border-stone-100 pb-6">
        <div className="p-4 bg-orange-100 text-orange-700 rounded-xl">
          <UserPlus className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-950">Novo Cadastro</h1>
          <p className="text-stone-600 mt-1">
            Crie uma nova família e adicione os membros.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Nome da Família <span className="text-orange-600">*</span>
          </label>
          <input
            required
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="Ex: Família Silva"
            className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <label className="text-sm font-semibold text-stone-700">
              Membros da Família
            </label>
            <button
              type="button"
              onClick={addMemberField}
              className="flex items-center gap-1 text-sm text-emerald-600 font-semibold hover:text-emerald-700"
            >
              <Plus className="w-4 h-4" /> Adicionar Pessoa
            </button>
          </div>

          {members.map((member, index) => (
            <div
              key={index}
              className="flex gap-4 items-start bg-stone-50 p-4 rounded-xl border border-stone-200"
            >
              <div className="flex-1">
                <input
                  required
                  type="text"
                  value={member.name}
                  onChange={(e) => updateMember(index, "name", e.target.value)}
                  placeholder="Nome"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div className="w-1/3">
                <select
                  value={member.role}
                  onChange={(e) => updateMember(index, "role", e.target.value)}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white outline-none"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMemberField(index)}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-6 border-t border-stone-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-orange-700 text-white px-8 py-3 rounded-xl hover:bg-orange-800 disabled:opacity-50 font-semibold transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Guardar Cadastro
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
