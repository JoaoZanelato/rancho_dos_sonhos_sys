const express = require("express");
const familyController = require("../controllers/familyController");

const router = express.Router();

// Rotas de Criação e Leitura (GET, POST)
router.get("/families", familyController.getFamilies);
router.post("/families", familyController.createFamily);
router.post("/families/:id/members", familyController.addMemberToFamily);
router.post("/families/:id/incomes", familyController.addIncomeToFamily);

// Rotas de Atualização e Exclusão (PUT, DELETE)
router.put("/families/:id", familyController.updateFamily);
router.delete("/families/:id", familyController.deleteFamily);
router.delete("/members/:id", familyController.deleteMember);

module.exports = router;
