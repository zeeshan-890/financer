const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    getAllReserved,
    createReserved,
    updateReserved,
    markAsPaid,
    deleteReserved,
    getTotalReserved
} = require('../controllers/reservedMoneyController');

router.use(protect);

router.route('/')
    .get(getAllReserved)
    .post(createReserved);

router.get('/total', getTotalReserved);

router.route('/:id')
    .put(updateReserved)
    .delete(deleteReserved);

router.put('/:id/paid', markAsPaid);

module.exports = router;
