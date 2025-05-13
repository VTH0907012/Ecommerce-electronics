
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const files = data.getAll('images') as File[]; // Note: changed from 'image' to 'images'

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
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
  } catch (error : any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}