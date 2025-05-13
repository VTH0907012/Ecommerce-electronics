const express = require('express');
const router = express.Router();
const { createOrder,updateOrderStatus,cancelOrder,getAllOrders ,getOrdersByUser,getRevenueByMonth} = require('../controllers/orderController');

router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus);  // cập nhật trạng thái
router.put('/:id/cancel', cancelOrder);  
router.get('/all', getAllOrders);
router.get('/user/:userId', getOrdersByUser);
router.get('/revenue-by-month', getRevenueByMonth);

module.exports = router;
