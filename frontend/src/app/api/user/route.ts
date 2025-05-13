import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axiosInstance from "../../../utils/axiosConfig"; 

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await axiosInstance.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    let message = "Đã có lỗi xảy ra";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Không tìm thấy token" }, { status: 401 });
    }

    const body = await req.json();

    // Giả sử user id được trả về từ /users/me (có thể lưu userId vào state frontend nếu muốn)
    const resMe = await axiosInstance.get("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userId = resMe.data._id;

    const updateRes = await axiosInstance.put(`/users/${userId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(updateRes.data);
  } catch (error: any) {
    console.error("Cập nhật thông tin lỗi:", error.message);
    return NextResponse.json(
      { message: error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật" },
      { status: 500 }
    );
  }
}