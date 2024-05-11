const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const { protect, isAdmin} = require('../middleware/authMiddleware');
const {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    getArchitectName,
    updateUserRole
} = require('../controllers/userControllers');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get all users (only accessible to admin users)
router.get( "/",protect,isAdmin, asyncHandler(async (req, res) => {
      const users = await User.find({});
      res.json({users: users});
    })
  );

// Update user profile
router.put('/:id', protect, updateUser);

// Delete user (only accessible to admin users)
router.delete('/:id', protect, deleteUser);

router.route('/:id/role').put(protect, updateUserRole);

router.get('/architects', async (req, res) => {
    try {
        const architects = await User.find({ role: 'architect' }).select('name'); // Query users with role "architect" and select only the username field
        const architectNames = architects.map(architect => architect.name); // Extract usernames
        res.json({ architects: architectNames });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/architect/name', protect, getArchitectName);
module.exports = router;