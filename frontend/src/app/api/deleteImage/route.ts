import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises'; // fs.promises để xóa file
import path from 'path';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/type/ErrorResponse';

export async function POST(req: NextRequest) {
  const { imagePath } = await req.json(); // nhận đường dẫn ảnh cũ từ client

  try {
    const fullPath = path.join(process.cwd(), imagePath); // tạo đường dẫn đầy đủ
    await unlink(fullPath); // xóa ảnh
    return NextResponse.json({ message: 'Xoá hình ảnh thành công' });
  } 
  catch (error: unknown) {
    const err = error as AxiosError<ErrorResponse>;
    return NextResponse.json(
    { 
      message: err.response?.data?.message || "Xoá hình ảnh thất bại" 
    },
    {
      status: err.response?.status || 500,
    }
  );
  }
}
