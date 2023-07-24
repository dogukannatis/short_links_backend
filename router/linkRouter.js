const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const linkController = require("../controllers/linkController");


// Get all links from database (Admin Operation)
router.get("/getAllLinks", [authMiddleware, adminMiddleware], linkController.getAllLinks);

// Get my all links
router.get("/getMyLinks", authMiddleware, linkController.getMyLinks);

// Save a link to the database
router.post("/add", authMiddleware, linkController.addLink);

// Delete a link with given id (Admin Operation)
router.delete("/delete/:id", [authMiddleware, adminMiddleware], linkController.deleteLinkWithId);

// Delete all links from database (Admin Operation)
router.delete("/deleteAll", [authMiddleware, adminMiddleware], linkController.deleteAll);

// Delete user's link with given id
router.delete("/deleteMyLink/:id", authMiddleware, linkController.deleteMyLink);

// Redirect to original link
router.get("/redirect/:ref", linkController.redirect);



module.exports = router;