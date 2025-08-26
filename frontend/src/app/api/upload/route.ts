
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/types/ErrorResponse';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const files = data.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Không có file nào được upload' }, { status: 400 });
    }

    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name}`;
        const uploadPath = path.join(process.cwd(), 'public/uploads', filename);

        await writeFile(uploadPath, buffer);
        return `/uploads/${filename}`;
      })
    );

    return NextResponse.json({ imageUrls });
  } 
  catch (error: unknown) {
    const err = error as AxiosError<ErrorResponse>;
    return NextResponse.json(
      { 
        message: err.response?.data?.message || "Đã có lỗi xảy ra" 
      },
      {
        status: err.response?.status || 500,
      }
    );
  }
}