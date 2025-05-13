import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Liên hệ</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Liên hệ chúng tôi khi bạn cần hỗ trợ
        </p>
      </div>
      <hr className="max-w-md mx-auto my-8 border-t-2 border-gray-300 rounded-full shadow-sm" />

      <div className="max-w-7xl mx-auto">
        <section className="py-16 container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2 bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Thông Tin Liên Hệ
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-blue-600 mt-1">
                    <FaMapMarkerAlt size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Địa Chỉ</h3>
                    <p className="text-gray-600">
                      3/2 Quận Ninh Kiều, Thành phố Cần Thơ
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-blue-600 mt-1">
                    <FaPhone size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Điện Thoại</h3>
                    <p className="text-gray-600">Hotline: 1900 1234</p>
                    <p className="text-gray-600">Hỗ trợ: 028 1234 5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-blue-600 mt-1">
                    <FaEnvelope size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-gray-600">support@ashop.vn</p>
                    <p className="text-gray-600">sales@ashop.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-blue-600 mt-1">
                    <FaClock size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Giờ Làm Việc</h3>
                    <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                    <p className="text-gray-600">Thứ 7 - CN: 8:00 - 12:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Gửi Tin Nhắn Cho Chúng Tôi
                </h2>
                <p className="text-gray-600 mb-6">
                  Bạn có câu hỏi hoặc cần hỗ trợ? Hãy điền vào form bên dưới và
                  chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
                </p>

                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-16">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Bản Đồ</h2>
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
              {/* Replace with your actual map embed */}

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.9666754054356!2d105.7550329745087!3d10.019608672698041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a088482fb773f7%3A0x6b3fac9bccaf9430!2zSOG6u20gMTMyIMSQLiAzIFRow6FuZyAyLCBOaW5oIEtp4buBdSwgQ-G6p24gVGjGoSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1747104173816!5m2!1svi!2s"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Google Map"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
