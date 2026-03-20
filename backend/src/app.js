const express = require("express");
const cors = require("cors");
const familyRoutes = require("./routes/familyRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Montando as rotas
app.use("/api", familyRoutes);

module.exports = app;
