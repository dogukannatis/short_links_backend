const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const statisticsController = require("../controllers/statisticsController");



// Get App Statistics
router.get("/getAll", statisticsController.getAll);


module.exports = router;