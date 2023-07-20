const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const linkController = require("../controllers/linkController");

// Get all links from database
router.get("/getAllLinks", [authMiddleware, adminMiddleware], linkController.getAllLinks);

// Get my all links
router.get("/getMyLinks", authMiddleware, linkController.getMyLinks);

// Save a llink to the user
router.post("/add", authMiddleware, linkController.addLink);

router.delete("/delete/:id", [authMiddleware], linkController.deleteLinkWithId);

router.delete("/deleteMyLink/:id", [authMiddleware], linkController.deleteMyLink);


module.exports = router;