/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) return NextResponse.json({ error: 'FAL_KEY not configured' }, { status: 500 });

  fal.config({ credentials: FAL_KEY });

  try {
    const body = await req.json() as { imageDataUrl?: string; prompt?: string };
    const { imageDataUrl, prompt } = body;
    if (!imageDataUrl || !prompt) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const b64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const mime = imageDataUrl.match(/^data:(image\/\w+);base64,/)?.[1] ?? 'image/jpeg';
    const faceUrl = await fal.storage.upload(new Blob([Buffer.from(b64, 'base64')], { type: mime }));

    let imageUrl: string | undefined;

    // Try ip-adapter-face-id first (best face preservation)
    try {
      const r = await (fal.subscribe as any)('fal-ai/ip-adapter-face-id', {
        input: {
          face_image_url: faceUrl,
          prompt: `${prompt}, photorealistic, professional sports photography, sharp focus, 8k`,
          negative_prompt: 'cartoon, anime, blurry, low quality, deformed, different person, changed face',
          num_inference_steps: 30,
          guidance_scale: 5,
          ip_adapter_scale: 0.85,
          num_images: 1,
          enable_safety_checker: true,
        },
        pollInterval: 3000,
      });
      imageUrl = r?.data?.images?.[0]?.url;
    } catch {
      // Fallback: flux img2img at low strength keeps face more intact
      const r2 = await (fal.subscribe as any)('fal-ai/flux/dev/image-to-image', {
        input: {
          image_url: faceUrl,
          prompt: `${prompt}, photorealistic, professional sports photography, sharp focus, same person same face`,
          negative_prompt: 'different face, cartoon, anime, blurry, low quality',
          strength: 0.55,
          num_inference_steps: 28,
          guidance_scale: 3.5,
          num_images: 1,
          enable_safety_checker: true,
        },
        pollInterval: 3000,
      });
      imageUrl = r2?.data?.images?.[0]?.url;
    }

    if (!imageUrl) return NextResponse.json({ error: 'No image returned' }, { status: 502 });
    return NextResponse.json({ imageUrl });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[/api/fal]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
