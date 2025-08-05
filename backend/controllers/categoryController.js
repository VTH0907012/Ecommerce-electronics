const Category = require("../models/Category");

exports.getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await Category.findOne({ name: name.trim() });

    if (existing) {
      return res.status(400).json({ message: "Tên danh mục đã tồn tại." });
    }

    const newCat = new Category(req.body);
    await newCat.save();
    res.status(201).json(newCat);
  } catch (err) {
    console.error("Lỗi khi tạo danh mục:", err);
    res.status(500).json({ message: "Có lỗi xảy ra khi tạo danh mục." });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const existing = await Category.findOne({ name: name.trim(), _id: { $ne: id } });

    if (existing) {
      return res.status(400).json({ message: "Tên danh mục đã tồn tại." });
    }

    const updated = await Category.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);

  } catch (err) {
    console.error("Lỗi khi cập nhật danh mục:", err);
    res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật danh mục." });
  }
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Danh mục đã xoá" });
};

