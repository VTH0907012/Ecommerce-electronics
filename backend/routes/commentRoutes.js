const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { protect,admin } = require("../middleware/authMiddleware");

router.post("/:productId", protect, commentController.createComment);
router.get("/:productId", commentController.getCommentsByProduct);
router.delete("/:commentId", protect, commentController.deleteComment);
router.get('/', protect, admin, commentController.getAllComments);
module.exports = router;
