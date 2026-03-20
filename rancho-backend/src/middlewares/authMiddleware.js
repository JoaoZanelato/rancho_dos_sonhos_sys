const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Acesso negado. Token não fornecido." });
  }

  // O token vem no formato "Bearer asdasdasd...", então cortamos para pegar só o código
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Tudo certo, pode entrar!
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Token inválido ou expirado. Faça login novamente." });
  }
};

module.exports = authMiddleware;
