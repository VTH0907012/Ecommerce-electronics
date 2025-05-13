const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  try {
    const { userId, shippingInfo, items, total } = req.body;

    if (!userId || !shippingInfo || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Thông tin đơn hàng không hợp lệ." });
    }

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Sản phẩm với ID ${item.productId} không tồn tại.`,
        });
      }

      if (product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `Sản phẩm ${product.name} không đủ số lượng.` });
      }

      product.quantity -= item.quantity;
      await product.save();
    }

 
    const newOrder = new Order({
      userId,
      shippingInfo,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
    });
    const savedOrder = await newOrder.save();

    res
      .status(201)
      .json({ message: "Đặt hàng thành công!", order: savedOrder });
  } catch (err) {
    console.error("Lỗi tạo đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server khi tạo đơn hàng." });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.quantity += item.quantity;
          await product.save();
        }
      }
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json({
      message: "Cập nhật trạng thái thành công.",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật trạng thái." });
  }
};


exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: 'Chỉ có thể hủy đơn khi đang ở trạng thái "pending".',
      });
    }

    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    order.status = "cancelled";
    const cancelledOrder = await order.save();

    res.json({
      message: "Đơn hàng đã được hủy.",
      order: cancelledOrder,
      items: order.items,
    });
  } catch (err) {
    console.error("Lỗi khi hủy đơn:", err);
    res.status(500).json({ message: "Lỗi server khi hủy đơn hàng." });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Mới nhất lên đầu
    res.json(orders);
  } catch (err) {
    console.error("Lỗi lấy danh sách đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách đơn hàng." });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Thiếu userId." });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Lỗi khi lấy đơn hàng theo userId:", err);
    res.status(500).json({ message: "Lỗi server khi lấy đơn hàng." });
  }
};

exports.getRevenueByMonth = async (req, res) => {
  try {
    const revenueData = await Order.aggregate([
      {
        $match: {
          status: "delivered",
        },
      },
      {
        $unwind: "$items", 
      },
      {
        $project: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          total: 1,
          quantity: "$items.quantity",
          productId: "$items.productId",
          productName: "$items.name"
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
            productId: "$productId",
            productName: "$productName"
          },
          totalSold: { $sum: "$quantity" },
          totalRevenue: { $sum: "$total" },
        },
      },
      {
        $group: {
          _id: { year: "$_id.year", month: "$_id.month" },
          totalRevenue: { $sum: "$totalRevenue" },
          totalProductsSold: { $sum: "$totalSold" },
          products: {
            $push: {
              productId: "$_id.productId",
              name: "$_id.productName",
              quantity: "$totalSold",
            },
          },
        },
      },
      {
        $addFields: {
          topProducts: {
            $slice: [
              {
                $sortArray: {
                  input: "$products",
                  sortBy: { quantity: -1 },
                },
              },
              5,
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalRevenue: 1,
          totalProductsSold: 1,
          topProducts: 1,
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    res.json({ revenueData });
  } catch (err) {
    console.error("Lỗi khi lấy thống kê doanh thu theo tháng:", err);
    res.status(500).json({ message: "Lỗi server khi lấy thống kê doanh thu theo tháng." });
  }
};
