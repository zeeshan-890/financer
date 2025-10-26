const express = require('express');
const router = express.Router();
const paymentRequestController = require('../controllers/paymentRequestController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, paymentRequestController.getAllRequests);
router.post('/', auth, paymentRequestController.createRequest);
router.put('/:id', auth, paymentRequestController.updateRequest);
router.put('/:id/paid', auth, paymentRequestController.markAsPaid);
router.post('/:id/remind', auth, paymentRequestController.sendReminder);
router.delete('/:id', auth, paymentRequestController.deleteRequest);

module.exports = router;
