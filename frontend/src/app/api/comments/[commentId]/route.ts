import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "@/utils/axiosConfig";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Không có token" }, { status: 401 });
  }

  try {
    const res = await axiosInstance.delete(
      `/api/comments/${params.commentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
