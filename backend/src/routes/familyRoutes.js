const express = require("express");
const router = express.Router();
const familyController = require("../controllers/familyController");

router.get("/families", familyController.getFamilies);
router.post("/families", familyController.createFamily);
router.post("/families/:id/members", familyController.addMemberToFamily);

module.exports = router;
