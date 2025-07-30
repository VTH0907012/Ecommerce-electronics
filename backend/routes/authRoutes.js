const express = require("express");
const router = express.Router();
const {
  register,
  login,
  updateUser,
  deleteUser,
  toggleBlockUser,
  toggleAdmin,
  getAllUsers,
  getUser,
  changePassword

} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/block", toggleBlockUser);
router.patch("/users/:id/admin", toggleAdmin);
router.get('/users/me', protect, getUser); 
router.post('/users/change-password', protect, changePassword); 

module.exports = router;
