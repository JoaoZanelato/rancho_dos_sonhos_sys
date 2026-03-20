const express = require("express");
const cors = require("cors");
const familyRoutes = require("./routes/familyRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// 1. Rota PÚBLICA (qualquer um pode tentar fazer login)
app.use("/api/auth", authRoutes);

// 2. Rotas PROTEGIDAS (O middleware barra quem não tem token)
app.use("/api", authMiddleware, familyRoutes);

module.exports = app;
