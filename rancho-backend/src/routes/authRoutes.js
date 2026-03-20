const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const validUser = process.env.ADMIN_USER;
  const validPass = process.env.ADMIN_PASSWORD;

  if (username === validUser && password === validPass) {
    // Se a senha estiver correta, gera um bilhete de acesso (token) válido por 7 dias
    const token = jwt.sign({ user: username }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: "Usuário ou senha incorretos." });
  }
});

module.exports = router;
