const mongoose = require("mongoose");
// const orderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   shippingInfo: {
//     fullName: String,
//     phone: String,
//     address: String,
//     note: String,
//     paymentMethod: String,
//   },
//   items: [
//     {
//       _id: false,
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//       quantity: Number,
//       name: String,
//       price: Number,
//     },
//   ],
//   total: Number,
//   status: {
//     type: String,
//     enum: ["pending", "shipped", "delivered", "cancelled"],
//     default: "pending",
//   },
//   createdAt: { type: Date, default: Date.now },
// });
// module.exports = mongoose.model("Order", orderSchema);


const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shippingInfo: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: String,
    paymentMethod: { 
      type: String, 
      enum: ["cod", "vnpay"], 
      required: true 
    },
  },
  items: [
    {
      _id: false,
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
      },
      quantity: { type: Number, required: true, min: 1 },
      name: { type: String, required: true },
      price: { type: Number, required: true, min: 0 },
    },
  ],
  total: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["pending_payment_vnpay", "pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  //paymentId: String, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Thêm hook tự động cập nhật updatedAt
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Order", orderSchema);