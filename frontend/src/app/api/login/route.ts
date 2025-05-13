import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "../../../utils/axiosConfig"; // Import axiosInstance của bạn

export async function POST(req: NextRequest) {
  try {
    const { email, password }: { email: string; password: string } =
      await req.json();

    // Sử dụng axiosInstance thay vì fetch
    const res = await axiosInstance.post("/login", { email, password });

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
  } catch (error: unknown) {
    let message = "Đã có lỗi xảy ra";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
