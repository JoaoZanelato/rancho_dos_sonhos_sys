import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Lock, User, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("rancho_token", data.token);
        navigate("/");
      } else {
        setError(data.error || "Erro ao iniciar sessão");
      }
    } catch (err) {
      setError("Erro de ligação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-stone-200">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-emerald-950 rounded-2xl mb-4 shadow-inner">
            <Camera className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Rancho dos Sonhos
          </h1>
          <p className="text-stone-500 mt-1">Acesso restrito ao sistema</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Utilizador
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-600 outline-none transition-all bg-stone-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Palavra-passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-600 outline-none transition-all bg-stone-50 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-700 text-white py-3.5 rounded-xl hover:bg-orange-800 transition-colors font-bold text-lg mt-4 flex justify-center shadow-md disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Entrar no Sistema"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
