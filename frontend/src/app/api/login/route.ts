import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "../../../utils/axiosConfig"; // Import axiosInstance của bạn
import { AxiosError } from "axios";
import { ErrorResponse } from "@/type/ErrorResponse";

export async function POST(req: NextRequest) {
  try {
    const { email, password }: { email: string; password: string } =
      await req.json();

    // Sử dụng axiosInstance thay vì fetch
    const res = await axiosInstance.post("/api/login", { email, password });

    const data = res.data;

    if (res.status !== 200) {
      return NextResponse.json(
        { message: data.message || "Đăng nhập thất bại" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      message: "Đăng nhập thành công",
      user: data.user,
      status: 200
    });

    response.cookies.set("token", data.token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
    });

    response.cookies.set("isAdmin", data.user.isAdmin ? "true" : "false");

    return response;
  } 
  catch (error: unknown) {
  const err = error as AxiosError<ErrorResponse>;
  return NextResponse.json(
    { 
      message: err.response?.data?.message || "Đã có lỗi xảy ra" 
    },
    {
      status: err.response?.status || 500,
    }
    );
  }
}
