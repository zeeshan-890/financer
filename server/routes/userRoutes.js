const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/search', protect, userController.searchUsers);
router.get('/:id', protect, userController.getUser);
router.put('/profile', protect, userController.updateUser);

// Balance PIN routes
router.post('/balance-pin', protect, userController.setBalancePin);
router.post('/balance-pin/verify', protect, userController.verifyBalancePin);
router.delete('/balance-pin', protect, userController.removeBalancePin);

module.exports = router;
