import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axiosInstance from "../../../../utils/axiosConfig"; 
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/ErrorResponse";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await axiosInstance.get("/api/users/me", {
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

    const resMe = await axiosInstance.get("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userId = resMe.data._id;

    const updateRes = await axiosInstance.put(`/api/users/${userId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(updateRes.data);
  }   catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      return NextResponse.json(
      { 
        message: err.response?.data?.message || "Đã có lỗi xảy ra khi cập nhật" 
      },
      {
        status: err.response?.status || 500,
      }
      );
    }
}