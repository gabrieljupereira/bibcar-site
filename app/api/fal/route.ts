/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) return NextResponse.json({ error: 'FAL_KEY not configured' }, { status: 500 });

  fal.config({ credentials: FAL_KEY });

  try {
    const body = await req.json() as { prompt?: string };
    const { prompt } = body;
    if (!prompt) return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });

    // Pure text-to-image: generates a perfect professional footballer, always works
    const r = await (fal.subscribe as any)('fal-ai/flux/dev', {
      input: {
        prompt,
        negative_prompt: 'ugly, blurry, distorted, cartoon, extra limbs, bad anatomy, watermark, text, amateur, low quality',
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        image_size: 'portrait_4_3',
        enable_safety_checker: true,
      },
      pollInterval: 3000,
    });

    const imageUrl: string | undefined = r?.data?.images?.[0]?.url ?? r?.images?.[0]?.url;
    console.log('[flux-t2i]', imageUrl ? 'ok' : 'no image');

    if (!imageUrl) return NextResponse.json({ error: 'No image from fal.ai' }, { status: 502 });
    return NextResponse.json({ imageUrl });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[/api/fal]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
