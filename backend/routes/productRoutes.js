const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route cho CRUD sản phẩm
router.post('/', productController.createProduct);
router.put('/:productId', productController.updateProduct);
router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getProductById);
router.delete('/:productId', productController.deleteProduct);

module.exports = router;
