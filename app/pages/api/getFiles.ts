import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category } = req.query;
  
  if (typeof category !== 'string') {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const folderPath = path.join(process.cwd(), 'public', category);
    const files = await fs.readdir(folderPath);
    const filteredFiles = files.filter(file => 
      /\.(png|jpe?g|gif|mp4|webm)$/i.test(file)
    ).map(file => `/${category}/${file}`);
    
    res.status(200).json(filteredFiles);
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Error reading files' });
  }
}