
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axiosInstance from "../../../../utils/axiosConfig";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/ErrorResponse";

export async function PUT(req: Request) {
  try {
     const cookieStore = await cookies();
     const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); 

    const body = await req.json();

    const res = await axiosInstance.put(`/api/blogs/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(res.data);
  }catch (error: unknown) {
    const err = error as AxiosError<ErrorResponse>;
    return NextResponse.json(
      {
        message:
          err.response?.data?.message || "Cập nhật blog thất bại",
      },
      {
        status: err.response?.status || 500,
      }
    );
  }
}

export async function DELETE(req: Request) {
  try {
     const cookieStore = await cookies();
     const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    const res = await axiosInstance.delete(`/api/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    const err = error as AxiosError<ErrorResponse>;
    return NextResponse.json(
      {
        message: err.response?.data?.message || "Xoá blog thất bại",
      },
      {
        status: err.response?.status || 500,
      }
    );
  }
}
