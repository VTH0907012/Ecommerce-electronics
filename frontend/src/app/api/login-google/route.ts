import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/utils/axiosConfig";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/type/ErrorResponse";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    const res = await axiosInstance.post("/api/google-login", { token });
    const data = res.data;

    const response = NextResponse.json({
      message: "Đăng nhập Google thành công",
      user: data.user,
      status: 200,
    });

    response.cookies.set("token", data.token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error: unknown) {
    const err = error as AxiosError<ErrorResponse>;
    return NextResponse.json(
      {
        message: err.response?.data?.message || "Đã có lỗi xảy ra",
      },
      {
        status: err.response?.status || 500,
      }
    );
  }
}
