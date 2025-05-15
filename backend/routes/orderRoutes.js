const express = require('express');
const router = express.Router();
const { createTempOrder,getOrderById,createOrder,updateOrderStatus,cancelOrder,getAllOrders ,getOrdersByUser,getRevenueByMonth,createVnpayPayment,checkVnpayPayment} = require('../controllers/orderController');

router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus);  // cập nhật trạng thái
router.put('/:id/cancel', cancelOrder);  
router.get('/all', getAllOrders);
router.get('/user/:userId', getOrdersByUser);
router.get('/revenue-by-month', getRevenueByMonth);
router.get('/:id/details', getOrderById);  
router.post('/temp', createTempOrder);

router.post('/creat-payment-vnpay', createVnpayPayment);
router.get('/check-payment-vnpay', checkVnpayPayment);

module.exports = router;
