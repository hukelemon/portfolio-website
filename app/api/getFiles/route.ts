import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');

  if (!category) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  try {
    const folderPath = path.join(process.cwd(), 'public', category);
    const files = await fs.readdir(folderPath);
    const filteredFiles = files.filter(file => 
      /\.(png|jpe?g|gif|mp4|webm)$/i.test(file)
    ).map(file => `/${category}/${file}`);
    
    return NextResponse.json(filteredFiles);
  } catch (error) {
    console.error('Error reading directory:', error);
    return NextResponse.json({ error: 'Error reading files' }, { status: 500 });
  }
}