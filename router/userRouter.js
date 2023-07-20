const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const userController = require("../controllers/userController");



router.get("/", async (req, res) => {

    res.json({
        "message" : "API"
    });

});

// Get all user data
router.get("/getAllUsers", [authMiddleware, adminMiddleware], userController.getAllUsers);

// Login to the system
router.post("/signin", userController.signIn);

// Get user data
router.get("/me", authMiddleware, userController.getMyData);

// Update user data
router.patch("/me", authMiddleware, userController.updateUserDate);

// Get user data with id
router.get("/:id", userController.getUserWithId);

// Save user data to the database
router.post("/saveUser", userController.saveUser);

// Update user data
router.patch("/updateUser/:id", userController.updateUser)

// Delete user data
router.delete("/me", authMiddleware, userController.deleteUser);

// Delete user with id
router.delete("/:id", [authMiddleware, adminMiddleware], userController.deleteUserWithId);

// Delete all users from database
router.get("/deleteAllUsers", [authMiddleware, adminMiddleware], userController.deleteAllUsers);









module.exports = router;

