import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

export const runtime = 'nodejs';
export const maxDuration = 120;

const PROMPT =
  'Brazilian football player wearing yellow and green national team jersey number 10, Maracanã stadium crowd background, professional sports photography, photorealistic, sharp focus, athletic pose, FIFA World Cup 2026';

export async function POST(req: NextRequest) {
  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) {
    return NextResponse.json({ error: 'FAL_KEY not configured' }, { status: 500 });
  }

  fal.config({ credentials: FAL_KEY });

  try {
    const body = await req.json() as { imageDataUrl?: string };
    const { imageDataUrl } = body;

    if (!imageDataUrl) {
      return NextResponse.json({ error: 'Missing imageDataUrl' }, { status: 400 });
    }

    // Convert base64 data URL to Blob for fal storage upload
    const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const mimeMatch = imageDataUrl.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const buffer = Buffer.from(base64Data, 'base64');
    const blob = new Blob([buffer], { type: mimeType });

    // Upload to fal storage — returns a stable URL
    const uploadedUrl = await fal.storage.upload(blob);

    // Run image-to-image
    const result = await fal.subscribe('fal-ai/flux/dev/image-to-image', {
      input: {
        image_url: uploadedUrl,
        prompt: PROMPT,
        strength: 0.82,
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true,
      },
      pollInterval: 3000,
    }) as { data?: { images?: { url: string }[] } };

    const imageUrl = result?.data?.images?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image returned from fal.ai' }, { status: 502 });
    }

    return NextResponse.json({ imageUrl });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[/api/fal] error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
