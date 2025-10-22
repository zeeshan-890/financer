const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, transactionController.addTransaction);
router.get('/', auth, transactionController.getAllTransactions);
router.get('/stats', auth, transactionController.getTransactionStats);
router.patch('/:id/payment-status', auth, transactionController.updatePaymentStatus);
router.patch('/:id/pay', auth, transactionController.updatePaymentStatus);
router.delete('/:id', auth, transactionController.deleteTransaction);

module.exports = router;
