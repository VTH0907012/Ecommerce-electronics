import { FaShippingFast, FaSyncAlt, FaShieldAlt, FaHeadset } from "react-icons/fa";

const reasons = [
  {
    icon: <FaShippingFast className="text-3xl text-blue-600" />,
    title: "Miễn phí vận chuyển",
    description: "Cho tất cả đơn hàng từ 200$",
  },
  {
    icon: <FaSyncAlt className="text-3xl text-blue-600" />,
    title: "Đổi trả 1 đổi 1",
    description: "Hủy đơn trong vòng 1 ngày",
  },
  {
    icon: <FaShieldAlt className="text-3xl text-blue-600" />,
    title: "Thanh toán an toàn 100%",
    description: "Cam kết thanh toán bảo mật",
  },
  {
    icon: <FaHeadset className="text-3xl text-blue-600" />,
    title: "Hỗ trợ 24/7",
    description: "Bất kỳ lúc nào, bất kỳ nơi đâu",
  },
];

const WhyUs = () => (
  <section className="py-5 px-4">
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {reasons.map((r, index) => (
        <div key={index} className="flex flex-col items-center p-4">
          {r.icon}
          <h3 className="font-semibold text-lg mt-3">{r.title}</h3>
          <p className="text-gray-600 text-sm mt-1">{r.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default WhyUs;
