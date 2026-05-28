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

    // Strategy 1: photomaker — preserves face identity best
    try {
      const r = await (fal.subscribe as any)('fal-ai/photomaker', {
        input: {
          image_archive_url: faceUrl,
          prompt: `img ${prompt}, photorealistic, professional sports photography, sharp focus`,
          style_name: 'Photographic (Default)',
          num_steps: 30,
          style_strength_ratio: 20,
          num_images: 1,
        },
        pollInterval: 3000,
      });
      imageUrl = r?.data?.images?.[0]?.url ?? r?.images?.[0]?.url;
      console.log('[fal/photomaker] imageUrl:', imageUrl);
    } catch (e1) {
      console.error('[fal/photomaker] failed:', String(e1));
    }

    // Strategy 2: flux img2img at low strength (0.55 keeps face mostly intact)
    if (!imageUrl) {
      try {
        const r = await (fal.subscribe as any)('fal-ai/flux/dev/image-to-image', {
          input: {
            image_url: faceUrl,
            prompt: `${prompt}, photorealistic, professional sports photography, sharp focus, same face`,
            strength: 0.55,
            num_inference_steps: 28,
            guidance_scale: 3.5,
            num_images: 1,
            enable_safety_checker: true,
          },
          pollInterval: 3000,
        });
        imageUrl = r?.data?.images?.[0]?.url ?? r?.images?.[0]?.url;
        console.log('[fal/flux-img2img] imageUrl:', imageUrl);
      } catch (e2) {
        console.error('[fal/flux-img2img] failed:', String(e2));
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
