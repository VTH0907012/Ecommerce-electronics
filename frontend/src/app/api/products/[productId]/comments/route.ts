import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axiosInstance from "../../../../../utils/axiosConfig";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Không có token" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const res = await axiosInstance.post(
      `/api/comments/${productId}`,
      body,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
