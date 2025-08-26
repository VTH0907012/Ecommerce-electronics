"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { AppDispatch } from "@/redux";
import { loginFacebook, loginGoogle, loginUser } from "@/utils/authApi";
import { setCredentials } from "@/redux/userSlice";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { FaFacebook } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

// Declare Facebook SDK type
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Initialize Facebook SDK
  useEffect(() => {
    const loadFacebookSDK = () => {
      // Kiểm tra nếu script đã được load
      if (document.getElementById("facebook-jssdk")) {
        return;
      }

      // Tạo script element
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.src = "https://connect.facebook.net/vi_VN/sdk.js";

      // Thêm vào head
      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    };

    // Khởi tạo Facebook SDK
    window.fbAsyncInit = function () {
      if (window.FB) {
        window.FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "your-app-id",
          cookie: true,
          xfbml: true,
          version: "v18.0",
        });
        console.log("Facebook SDK initialized");
      }
    };

    loadFacebookSDK();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginUser(email, password);
      if (res.status == 200) {
        dispatch(setCredentials(res));
        toast.success("Đăng nhập thành công!");
        router.push("/checkout");
      }
    } catch (err: any) {
      console.log(err);
      toast.error("Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng nhập Facebook
  const handleFacebookLogin = async () => {
    setIsFacebookLoading(true);

    try {
      // Kiểm tra Facebook SDK
      if (!window.FB) {
        toast.error(
          "Facebook SDK chưa được tải. Vui lòng thử lại sau ít giây."
        );
        setIsFacebookLoading(false);
        return;
      }

      // Kiểm tra trạng thái đăng nhập Facebook
      window.FB.getLoginStatus((response: any) => {
        if (response.status === "connected") {
          // Đã đăng nhập Facebook, xử lý login
          handleFacebookResponse(response);
        } else {
          // Chưa đăng nhập Facebook, hiển thị popup đăng nhập
          window.FB.login(
            (loginResponse: any) => {
              handleFacebookResponse(loginResponse);
            },
            { scope: "email,public_profile" }
          );
        }
      });
    } catch (error: any) {
      console.error("Facebook login error:", error);
      toast.error("Lỗi khi đăng nhập Facebook");
      setIsFacebookLoading(false);
    }
  };

  // Xử lý response từ Facebook
  const handleFacebookResponse = async (response: any) => {
    try {
      if (response.authResponse && response.status === "connected") {
        const { accessToken, userID } = response.authResponse;

        const res = await loginFacebook(accessToken, userID);

        if (res.status === 200) {
          dispatch(setCredentials(res));
          toast.success("Đăng nhập Facebook thành công!");
          router.push("/checkout");
        } else {
          toast.error(res.message || "Đăng nhập Facebook thất bại");
        }
      } else {
        toast.error("Đăng nhập Facebook bị hủy hoặc thất bại");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Đăng nhập Facebook thất bại";

      toast.error(errorMessage);
    } finally {
      setIsFacebookLoading(false);
    }
  };

  // Đăng nhập Google
  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const res = await loginGoogle(credentialResponse.credential);
      if (res.status == 200) {
        dispatch(setCredentials(res));
        toast.success("Đăng nhập Google thành công!");
        router.push("/checkout");
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      toast.error("Đăng nhập Google thất bại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 space-y-6 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Chào mừng trở lại
          </h2>
          <p className="text-gray-500 mt-2">Đăng nhập để tiếp tục</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition ${
              isLoading ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              <>
                Đăng nhập <FiArrowRight className="ml-2" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Hoặc đăng nhập bằng
            </span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex justify-center gap-3">
          {/* Google Login */}
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google Login thất bại")}
          />

          {/* Facebook Login */}
          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={isFacebookLoading}
            className={`flex items-center justify-center px-4 py-2 rounded-lg bg-[#1877F2] text-white font-medium hover:bg-[#166FE5] transition ${
              isFacebookLoading ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {isFacebookLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              <>
                <FaFacebook className="mr-2 h-5 w-5" />
                Facebook
              </>
            )}
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          Bạn chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
