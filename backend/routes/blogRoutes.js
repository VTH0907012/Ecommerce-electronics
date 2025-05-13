const express = require('express');
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const {  protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, createBlog);
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.put('/:id', protect, admin, updateBlog);
router.delete('/:id', protect, admin, deleteBlog);

module.exports = router;
