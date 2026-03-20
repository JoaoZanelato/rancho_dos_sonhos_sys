// rancho-backend/server.js
const app = require('./src/app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend a correr localmente na porta ${PORT}`);
});