import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import ClientForm from "./pages/ClientForm";
import Login from "./pages/Login";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("rancho_token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clients />} />
          <Route path="clientes/novo" element={<ClientForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
