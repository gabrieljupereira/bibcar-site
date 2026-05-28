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

    // Strategy 1: InstantID — single reference image, best face identity preservation
    try {
      const r = await (fal.subscribe as any)('fal-ai/instant-id', {
        input: {
          face_image_url: faceUrl,
          prompt,
          negative_prompt: 'ugly, blurry, cartoon, painting, distorted face, different person, low quality, extra limbs',
          num_inference_steps: 30,
          guidance_scale: 5,
          ip_adapter_scale: 0.8,
          controlnet_conditioning_scale: 0.8,
        },
        pollInterval: 3000,
      });
      imageUrl = r?.data?.images?.[0]?.url ?? r?.images?.[0]?.url;
      console.log('[instant-id]', imageUrl ? 'ok' : 'no image');
    } catch (e) {
      console.error('[instant-id] failed:', String(e).slice(0, 200));
    }

    // Strategy 2: flux img2img very low strength — keeps ~75% of original, preserves face
    if (!imageUrl) {
      try {
        const r = await (fal.subscribe as any)('fal-ai/flux/dev/image-to-image', {
          input: {
            image_url: faceUrl,
            prompt,
            strength: 0.25,
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
