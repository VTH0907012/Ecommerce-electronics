


const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number }, // Giá giảm
  rating: { type: Number, default: 0 }, // Đánh giá trung bình (0-5)
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  quantity: { type: Number, required: true, default: 0 },
  //image: { type: String },
  images: [{ type: String }]

}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
