import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/utils/axiosConfig";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/ErrorResponse";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, userID } = await req.json();

    const res = await axiosInstance.post("/api/facebook-login", {
      accessToken,
      userID,
    });

    const data = res.data;

    const response = NextResponse.json({
      message: "Đăng nhập Facebook thành công",
      user: data.user,
      status: 200,
    });

    response.cookies.set("token", data.token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 ngày
    });

    return response;
  } catch (error: unknown) {
    const err = error as AxiosError<ErrorResponse>;
    return NextResponse.json(
      {
        message: err.response?.data?.message || "Đăng nhập Facebook thất bại",
      },
      {
        status: err.response?.status || 500,
      }
    );
  }
}
