const Comment = require('../models/Comment');
const Product = require('../models/Product');

// Tạo bình luận mới
exports.createComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user._id; 

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    const newComment = new Comment({
      product: productId,
      user: userId,
      content,
      rating,
    });

    await newComment.save();
    res.status(201).json({ message: 'Bình luận đã được thêm', comment: newComment });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm bình luận', error });
  }
};

// Lấy bình luận theo sản phẩm
exports.getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const comments = await Comment.find({ product: productId })
      .populate('user', 'name') 
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy bình luận', error });
  }
};

// Xoá bình luận (chỉ cho chính chủ hoặc admin)
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.isAdmin;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Không tìm thấy bình luận' });

    if (comment.user.toString() !== userId.toString() && !isAdmin) {
      return res.status(403).json({ message: 'Bạn không có quyền xoá bình luận này' });
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: 'Đã xoá bình luận' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xoá bình luận', error });
  }
};
// Lấy tất cả bình luận
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('user', 'name')
      .populate('product', 'name') 
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy tất cả bình luận', error });
  }
};