import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises'; // fs.promises để xóa file
import path from 'path';

export async function POST(req: NextRequest) {
  const { imagePath } = await req.json(); // nhận đường dẫn ảnh cũ từ client

  try {
    const fullPath = path.join(process.cwd(), imagePath); // tạo đường dẫn đầy đủ
    await unlink(fullPath); // xóa ảnh
    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error :unknown) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
