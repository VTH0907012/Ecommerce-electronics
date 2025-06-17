import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axiosInstance from "../../../utils/axiosConfig";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/type/ErrorResponse";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const body = await req.json();

    const res = await axiosInstance.post("/api/blogs", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(res.data);
  } 
  catch (error: unknown) {
      const err = error as AxiosError<ErrorResponse>;
      return NextResponse.json(
        { 
          message: err.response?.data?.message || "Tạo blog thất bại" 
        },
        {
          status: err.response?.status || 500,
        }
      );
  }
}
