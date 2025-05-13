const mongoose = require("mongoose");



// module.exports = mongoose.model('Order', orderSchema);

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  shippingInfo: {
    fullName: String,
    phone: String,
    address: String,
    note: String,
    paymentMethod: String,
  },
  items: [
    {
      _id: false,
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      name: String,
      price: Number,
    },
  ],
  total: Number,
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Order", orderSchema);
