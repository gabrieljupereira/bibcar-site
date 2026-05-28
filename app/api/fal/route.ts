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

    // Try photomaker first (best face identity preservation)
    try {
      const r = await (fal.subscribe as any)('fal-ai/photomaker', {
        input: {
          image_archive_url: faceUrl,
          // photomaker requires "img" trigger word in prompt
          prompt: `img person ${prompt}`,
          style_name: 'Photographic (Default)',
          num_steps: 30,
          style_strength_ratio: 15,
          num_images: 1,
        },
        pollInterval: 3000,
      });
      imageUrl = r?.data?.images?.[0]?.url ?? r?.images?.[0]?.url;
      console.log('[photomaker]', imageUrl ? 'ok' : 'no image');
    } catch (e) {
      console.error('[photomaker] failed:', String(e).slice(0, 200));
    }

    // Fallback: flux img2img low strength preserves face better
    if (!imageUrl) {
      try {
        const r = await (fal.subscribe as any)('fal-ai/flux/dev/image-to-image', {
          input: {
            image_url: faceUrl,
            prompt,
            strength: 0.52,
            num_inference_steps: 28,
            guidance_scale: 3.5,
            num_images: 1,
            enable_safety_checker: true,
          },
          pollInterval: 3000,
        });
        imageUrl = r?.data?.images?.[0]?.url ?? r?.images?.[0]?.url;
        console.log('[flux-img2img]', imageUrl ? 'ok' : 'no image');
      } catch (e) {
        console.error('[flux-img2img] failed:', String(e).slice(0, 200));
      }
    }

    if (!imageUrl) return NextResponse.json({ error: 'No image returned from fal.ai' }, { status: 502 });
    return NextResponse.json({ imageUrl });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[/api/fal]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
