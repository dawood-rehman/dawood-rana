import fs from 'fs';
import path from 'path';

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get('resume');
    if (!file) {
      return new Response(JSON.stringify({ success: false, message: 'No file uploaded' }), { status: 400 });
    }

    const filename = file.name || 'resume.pdf';
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const publicPath = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath, { recursive: true });

    // Save with a stable filename
    const savePath = path.join(publicPath, 'resume' + path.extname(filename));
    await fs.promises.writeFile(savePath, buffer);

    return new Response(JSON.stringify({ success: true, url: '/resume' + path.extname(filename) }), { status: 200 });
  } catch (err) {
    console.error('Upload resume error:', err);
    return new Response(JSON.stringify({ success: false, message: 'Server error' }), { status: 500 });
  }
};
