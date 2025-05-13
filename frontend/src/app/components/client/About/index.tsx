import Image from "next/image";
import {
  FaShieldAlt,
  FaHeadset,
  FaShippingFast,
  FaRecycle,
} from "react-icons/fa";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Về chúng tôi</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Các thông tin về chúng tôi
        </p>
      </div>
      <hr className="max-w-md mx-auto my-8 border-t-2 border-gray-300 rounded-full shadow-sm" />

      <div className="max-w-7xl mx-auto">
        {/* Our Story */}
        <section className="py-16 container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <Image
                src="/images/thanh_lap.jpg"
                alt="Our Story"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Câu Chuyện Của Chúng Tôi
              </h2>
              <p className="text-gray-600 mb-4">
                AShop được thành lập năm 2020 với sứ mệnh mang đến những sản
                phẩm công nghệ chất lượng cao với giá cả phải chăng.
              </p>
              <p className="text-gray-600 mb-4">
                Từ một cửa hàng nhỏ, chúng tôi đã phát triển thành hệ thống bán
                lẻ điện tử hàng đầu, phục vụ hàng trăm nghìn khách hàng mỗi năm.
              </p>
              <p className="text-gray-600">
                Chúng tôi tin rằng công nghệ nên làm cuộc sống dễ dàng hơn, và
                nhiệm vụ của chúng tôi là giúp bạn tìm được sản phẩm phù hợp
                nhất.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Giá Trị Cốt Lõi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <FaShieldAlt className="text-blue-600 text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Chất Lượng</h3>
                <p className="text-gray-600">
                  Sản phẩm chính hãng, bảo hành đầy đủ
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <FaHeadset className="text-purple-600 text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Hỗ Trợ 24/7</h3>
                <p className="text-gray-600">
                  Đội ngũ tư vấn nhiệt tình, chuyên nghiệp
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <FaShippingFast className="text-green-600 text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Giao Hàng Nhanh</h3>
                <p className="text-gray-600">
                  Miễn phí vận chuyển cho đơn từ 1 triệu
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <FaRecycle className="text-orange-600 text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Bền Vững</h3>
                <p className="text-gray-600">Cam kết bảo vệ môi trường</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Đội Ngũ Của Chúng Tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Võ Thanh Hiếu",
                role: "Founder & CEO",
                img: "/images/userman.png",
              },
              { name: "Trần Thị B", role: "CTO", img: "/images/userwoman.jpg" },
              {
                name: "Lê Văn C",
                role: "Head of Customer Service",
                img: "/images/userman.png",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col items-center" // Thêm flex-col và items-center
              >
                <Image
                  src={member.img}
                  alt={member.name}
                  width={400}
                  height={500}
                  className="h-60 w-60 object-cover rounded-full" // Thêm rounded-full nếu muốn hình tròn
                />
                <div className="p-6 text-center">
                  {" "}
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
