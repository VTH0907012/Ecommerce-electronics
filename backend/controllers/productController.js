const Product = require('../models/Product');

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
  try {

    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Sản phẩm đã được tạo thành công', product });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo sản phẩm', error });
  }
};

// Cập nhật sản phẩm (bao gồm cập nhật quantity)
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updatedData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
    res.status(200).json({ message: 'Sản phẩm được cập nhật thành công', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật', error });
  }
};

// Lấy danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category brand');
    //const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
  }
};

// Lấy thông tin sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate('category brand');
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error });
  }
};

// Xoá sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Sản phẩm đã được xoá thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xoá sản phẩm', error });
  }
};

