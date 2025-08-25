const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const crypto = require("crypto");

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify token từ Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: crypto.randomBytes(16).toString("hex"),
        googleId,
      });
      await user.save();
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Tài khoản đã bị khoá" });
    }

    const jwtToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });

    
  } catch (err) {
    res
      .status(500)
      .json({ message: "Google login thất bại", error: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Đã đăng ký thành công" });
  } catch (err) {
    res.status(500).json({ message: "Đã xảy ra lỗi", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    // Kiểm tra nếu tài khoản bị khoá
    if (user.isBlocked) {
      return res.status(403).json({ message: "Tài khoản đã bị khoá" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Thông tin đăng nhập không hợp lệ" });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Đăng nhập thất bại", error: err.message });
  }
};

//Login Google

//Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updates = { name, email };
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updates.password = hashed;
    }
    const updated = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Cập nhật thất bại", error: err.message });
  }
};

// Xoá tài khoản
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Người dùng đã được xóa" });
  } catch (err) {
    res.status(500).json({ message: "Xoá thất bại", error: err.message });
  }
};

// Khoá/mở khoá tài khoản
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `Người dùng đã bị ${user.isBlocked ? "chặn" : "bỏ chặn"}`,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Không thể chuyển đổi trạng thái chặn",
        error: err.message,
      });
  }
};

// Cấp quyền admin
const toggleAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({
      message: `Người dùng hiện tại là ${
        user.isAdmin ? "quản trị viên" : "người dùng thông thường"
      }`,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Không thể chuyển đổi trạng thái quản trị viên",
        error: err.message,
      });
  }
};

// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Không thể lấy danh sách người dùng",
        error: err.message,
      });
  }
};
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -isBlocked"
    );
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ mật khẩu cũ và mới" });
    }

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Mật khẩu cũ không đúng" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Thay đổi mật khẩu thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Thay đổi mật khẩu thất bại", error: err.message });
  }
};

module.exports = {
  register,
  login,
  updateUser,
  deleteUser,
  toggleBlockUser,
  toggleAdmin,
  getAllUsers,
  getUser,
  changePassword,
  googleLogin,
};
