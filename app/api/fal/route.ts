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
    // Input is a 512x512 face-only crop (top-center of the original photo)
    const faceUrl = await fal.storage.upload(new Blob([Buffer.from(b64, 'base64')], { type: mime }));

    let imageUrl: string | undefined;

    // ── STRATEGY 1: flux img2img at 0.70 on face crop ──
    // At this strength the model replaces background/clothes with the football scene
    // while keeping ~30% of the original face structure — enough to look like the person
    try {
      const r = await (fal.subscribe as any)('fal-ai/flux/dev/image-to-image', {
        input: {
          image_url: faceUrl,
          prompt,
          negative_prompt: 'ugly, blurry, distorted, cartoon, bad anatomy, office, indoor, suit, blazer, civilian clothes, close-up, portrait only, cropped face',
          strength: 0.72,
          num_inference_steps: 35,
          guidance_scale: 4.0,
          num_images: 1,
          enable_safety_checker: true,
        },
        pollInterval: 3000,
      });
      imageUrl = r?.data?.images?.[0]?.url ?? r?.images?.[0]?.url;
      console.log('[flux-0.70]', imageUrl ? 'ok' : 'no image');
    } catch (e) {
      console.error('[flux-0.70] failed:', String(e).slice(0, 200));
    }

    // ── STRATEGY 2: InstantID — face features via IP-Adapter, generates new scene ──
    if (!imageUrl) {
      try {
        const r = await (fal.subscribe as any)('fal-ai/instant-id', {
          input: {
            face_image_url: faceUrl,
            prompt,
            negative_prompt: 'ugly, blurry, cartoon, distorted face, deformed, artifacts, office, blazer, indoor',
            num_inference_steps: 50,
            guidance_scale: 3.5,
            ip_adapter_scale: 0.8,
            controlnet_conditioning_scale: 0.4,
          },
          pollInterval: 3000,
        });
        imageUrl = r?.data?.images?.[0]?.url ?? r?.images?.[0]?.url;
        console.log('[instant-id]', imageUrl ? 'ok' : 'no image');
      } catch (e) {
        console.error('[instant-id] failed:', String(e).slice(0, 200));
      }
    }

    // ── STRATEGY 3: flux img2img 0.55 fallback ──
    if (!imageUrl) {
      try {
        const r = await (fal.subscribe as any)('fal-ai/flux/dev/image-to-image', {
          input: {
            image_url: faceUrl,
            prompt,
            strength: 0.55,
            num_inference_steps: 28,
            guidance_scale: 3.5,
            num_images: 1,
            enable_safety_checker: true,
          },
          pollInterval: 3000,
        });
        imageUrl = r?.data?.images?.[0]?.url ?? r?.images?.[0]?.url;
        console.log('[flux-0.55]', imageUrl ? 'ok' : 'no image');
      } catch (e) {
        console.error('[flux-0.55] failed:', String(e).slice(0, 200));
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
