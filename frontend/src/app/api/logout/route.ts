import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
   // Xóa isAdmin cookie

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
  } catch (error: unknown) {
    let message = "Đã có lỗi xảy ra khi đăng xuất";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
