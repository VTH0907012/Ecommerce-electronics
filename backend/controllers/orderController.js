const Order = require("../models/Order");
const Product = require("../models/Product");
//require("dotenv").config();
require("dotenv").config();

const {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
} = require("vnpay");

// exports.createVnpayPayment = async (req, res) => {
//   try {
//     const { orderInfo, amount, ipAddr, orderId } = req.body;

//     // Validate order data
//     if (!orderInfo || !amount || ipAddr || !orderId) {
//       return res.status(400).json({ message: "Thiếu thông tin thanh toán" });
//     }

//     const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

//     const vnpay = new VNPay({
//       tmnCode: "HOWSW3XM",
//       secureSecret: "XD6H1KXEOZ9PXS5WOPLJT8TEYBVI1V64",
//       vnpayHost: "https://sandbox.vnpayment.vn",
//       testMode: true,
//       hashAlgorithm: "SHA512",
//       loggerFn: ignoreLogger,
//     });

//     const vnpayResponse = await vnpay.buildPaymentUrl({
//       vnp_Amount: amount , // Nhân 100 vì VNPay tính bằng đồng
//       //vnp_IpAddr: ipAddr ,
//       vnp_IpAddr: "127.0.0.1",
//       vnp_TxnRef: orderId, // Sử dụng orderId tạm
//       vnp_OrderInfo: JSON.stringify(orderId),
//       vnp_OrderType: ProductCode.Other,
//       vnp_ReturnUrl: `http://localhost:5000/api/orders/check-payment-vnpay`,
//       vnp_Locale: VnpLocale.VN,
//       vnp_CreateDate: dateFormat(new Date()),
//       vnp_ExpireDate: dateFormat(tomorrow),
//     });
//     //console.log(orderInfo,amount,ipAddr ,orderId);

//     res.status(200).json({
//       paymentUrl: vnpayResponse,
//       orderId: orderId // Trả về orderId tạm để frontend theo dõi
//     });
//   } catch (err) {
//     console.error("Lỗi tạo VNPay:", err);
//     res.status(500).json({ message: "Lỗi server khi tạo thanh toán" });
//   }
// };
exports.createVnpayPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Lấy thông tin đơn hàng từ database
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    const vnpay = new VNPay({
      tmnCode: `${process.env.VNP_TMNCODE}`,
      secureSecret: `${process.env.VNP_HASHSECRET}`,
      vnpayHost: `${process.env.VNP_URL}`,
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });

    const vnpayResponse = await vnpay.buildPaymentUrl({
      vnp_Amount: order.total,
      vnp_IpAddr: "127.0.0.1",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: JSON.stringify(orderId), // Chỉ truyền orderId
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: `${process.env.DOMAIN_URL_BE}/api/orders/check-payment-vnpay`,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(new Date(Date.now() + 24 * 60 * 60 * 1000)),
    });

    res.status(200).json({
      paymentUrl: vnpayResponse,
    });
  } catch (err) {
    console.error("Lỗi tạo VNPay:", err);
    res.status(500).json({ message: "Lỗi server khi tạo thanh toán" });
  }
};
// exports.checkVnpayPayment = async (req, res) => {
//   try {
//     const vnpay = new VNPay({
//       tmnCode: "HOWSW3XM",
//       secureSecret: "XD6H1KXEOZ9PXS5WOPLJT8TEYBVI1V64",
//       vnpayHost: "https://sandbox.vnpayment.vn",
//       testMode: true,
//       hashAlgorithm: "SHA512",
//       loggerFn: ignoreLogger,
//     });

//     const result = await vnpay.verifyReturnUrl(req.query);

//     if (result.isSuccess) {
//       // Tạo đơn hàng thật sự sau khi thanh toán thành công
//       const orderData = JSON.parse(result.vnp_OrderInfo); // Chứa thông tin đơn hàng từ frontend

//       const newOrder = new Order({
//         userId: orderData.userId,
//         shippingInfo: orderData.shippingInfo,
//         items: orderData.items,
//         total: result.vnp_Amount , // Chuyển lại về VND
//       });
//       const savedOrder = await newOrder.save();
//       // Trừ số lượng sản phẩm
//       for (const item of savedOrder.items) {
//         await Product.findByIdAndUpdate(
//           item.productId,
//           { $inc: { quantity: -item.quantity } }
//         );
//       }
//       return res.redirect(`${process.env.DOMAIN_URL_FE}/order-success/${savedOrder._id}`);
//     } else {
//       return res.redirect(`${process.env.DOMAIN_URL_FE}/payment-failed?reason=${result.message}`);
//     }
//   } catch (err) {
//     console.error("Lỗi xác minh thanh toán VNPay:", err);
//     return res.redirect(`${process.env.DOMAIN_URL_FE}/payment-failed?reason=Internal server error`);
//   }
// };
exports.checkVnpayPayment = async (req, res) => {
  try {
    const vnpay = new VNPay({
      tmnCode: `${process.env.VNP_TMNCODE}`,
      secureSecret: `${process.env.VNP_HASHSECRET}`,
      vnpayHost: `${process.env.VNP_URL}`,
      testMode: true,
      hashAlgorithm: "SHA512",
      loggerFn: ignoreLogger,
    });

    const result = await vnpay.verifyReturnUrl(req.query);

    if (result.isSuccess) {
      const orderId = result.vnp_OrderInfo.replace(/^"+|"+$/g, "");

      // Lấy đơn hàng từ database bằng ID
      const order = await Order.findById(orderId);
      if (!order) {
        return res.redirect(
          `${process.env.DOMAIN_URL_FE}/payment-failed?reason=Order not found`
        );
      }

      // Cập nhật trạng thái đơn hàng
      order.status = "pending";
      order.paymentId = result.vnp_TransactionNo;
      await order.save();

      // Trừ số lượng tồn kho
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: -item.quantity },
        });
      }

      return res.redirect(
        `${process.env.DOMAIN_URL_FE}/order-success/${order._id}`
      );
    } else {
      // Cập nhật trạng thái nếu thanh toán thất bại
      await Order.findByIdAndUpdate(result.vnp_OrderInfo, {
        status: "pending_payment_vnpay",
      });
      return res.redirect(
        `${process.env.DOMAIN_URL_FE}/payment-failed?reason=${result.message}`
      );
    }
  } catch (err) {
    console.error("Lỗi xác minh thanh toán VNPay:", err);
    return res.redirect(
      `${process.env.DOMAIN_URL_FE}/payment-failed?reason=Internal server error`
    );
  }
};

// Thêm vào orderController.js
exports.createTempOrder = async (req, res) => {
  try {
    const { userId, shippingInfo, items, total } = req.body;

    // Validate dữ liệu
    if (!userId || !shippingInfo || !items || !total) {
      return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
    }

    // Kiểm tra số lượng tồn kho
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${item.name} không đủ số lượng`,
        });
      }
    }

    // Tạo đơn hàng tạm (chưa trừ kho)
    const newOrder = new Order({
      userId,
      shippingInfo: {
        ...shippingInfo,
        paymentMethod: "vnpay",
      },
      items,
      total,
      status: "pending_payment_vnpay",
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Đơn hàng tạm được tạo thành công",
      order: savedOrder,
    });
  } catch (err) {
    console.error("Lỗi tạo đơn hàng tạm:", err);
    res.status(500).json({ message: "Lỗi server khi tạo đơn hàng" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error });
  }
};

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
      status: "pending",
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

// exports.cancelOrder = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
//     }

//     if (order.status !== "pending") {
//       return res.status(400).json({
//         message: 'Chỉ có thể hủy đơn khi đang ở trạng thái "pending".',
//       });
//     }

//     for (const item of order.items) {
//       const product = await Product.findById(item.productId);
//       if (product) {
//         product.quantity += item.quantity;
//         await product.save();
//       }
//     }

//     order.status = "cancelled";
//     const cancelledOrder = await order.save();

//     res.json({
//       message: "Đơn hàng đã được hủy.",
//       order: cancelledOrder,
//       items: order.items,
//     });
//   } catch (err) {
//     console.error("Lỗi khi hủy đơn:", err);
//     res.status(500).json({ message: "Lỗi server khi hủy đơn hàng." });
//   }
// };
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    // Check if order can be cancelled
    if (
      order.status !== "pending" &&
      order.status !== "pending_payment_vnpay"
    ) {
      return res.status(400).json({
        message:
          'Chỉ có thể hủy đơn khi đang ở trạng thái "pending" hoặc "pending_payment_vnpay".',
      });
    }

    // Only restore product quantity if order was in pending status
    if (order.status === "pending") {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.quantity += item.quantity;
          await product.save();
        }
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
          productName: "$items.name",
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
            productId: "$productId",
            productName: "$productName",
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
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy thống kê doanh thu theo tháng." });
  }
};
