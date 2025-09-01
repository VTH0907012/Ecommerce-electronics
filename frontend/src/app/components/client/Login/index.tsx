"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { AppDispatch } from "@/redux";
import { loginGoogle, loginUser, loginFacebook } from "@/utils/authApi"; // thêm loginFacebook
import { setCredentials } from "@/redux/userSlice";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Đăng nhập bằng email/password
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

  // Đăng nhập Facebook
  const handleFacebookLogin = async (response: any) => {
    try {
      const { accessToken, userID } = response;
      if (!accessToken || !userID) {
        toast.error("Không lấy được dữ liệu từ Facebook");
        return;
      }

      const res = await loginFacebook(accessToken, userID);
      if (res) {
        dispatch(setCredentials(res));
        toast.success("Đăng nhập Facebook thành công!");
        router.push("/checkout");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Đăng nhập Facebook thất bại");
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

        {/* Form login truyền thống */}
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

        {/* Social Login Buttons */}
        <div className="flex gap-4 justify-center">
          {/* Google Login */}
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google Login thất bại")}
          />

          {/* Facebook Login */}
          <FacebookLogin
            appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ""}
            onSuccess={handleFacebookLogin}
            onFail={() => toast.error("Facebook Login thất bại")}
            render={({ onClick }) => (
              <button
                onClick={onClick}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            )}
          />
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
