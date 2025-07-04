import { ErrorResponse } from "@/type/ErrorResponse";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.set("token", "", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });
    cookieStore.set("isAdmin", "", {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });
    return NextResponse.json({ message: "Đăng xuất thành công" });
  }
    catch (error: unknown) {
    const err = error as AxiosError<ErrorResponse>;
    return NextResponse.json(
      { 
        message: err.response?.data?.message || "Đã có lỗi xảy ra khi đăng xuất"
      },
      {
        status: err.response?.status || 500,
      }
      );
    }
}
