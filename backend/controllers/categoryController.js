const Category = require("../models/Category");

exports.getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.createCategory = async (req, res) => {
  const newCat = new Category(req.body);
  await newCat.save();
  res.status(201).json(newCat);
};

exports.updateCategory = async (req, res) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Danh mục đã xoá" });
};

