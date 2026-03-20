import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientForm from "./pages/ClientForm";
import Incomes from "./pages/Incomes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clients />} />
          <Route path="clientes/novo" element={<ClientForm />} />
          <Route path="renda" element={<Incomes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
