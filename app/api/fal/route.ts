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

    // ── STEP 1: Generate a perfect footballer portrait with flux text-to-image ──
    let footballerBodyUrl: string | undefined;
    try {
      const r = await (fal.subscribe as any)('fal-ai/flux/dev', {
        input: {
          prompt,
          negative_prompt: 'ugly, blurry, distorted, cartoon, extra limbs, watermark, text, logo, deformed face',
          num_inference_steps: 28,
          guidance_scale: 3.5,
          num_images: 1,
          image_size: 'portrait_4_3',
          enable_safety_checker: true,
        },
        pollInterval: 3000,
      });
      footballerBodyUrl = r?.data?.images?.[0]?.url ?? r?.images?.[0]?.url;
      console.log('[flux-t2i]', footballerBodyUrl ? 'ok' : 'no image');
    } catch (e) {
      console.error('[flux-t2i] failed:', String(e).slice(0, 200));
    }

    // ── STEP 2: Swap the user's real face onto the generated footballer body ──
    if (footballerBodyUrl) {
      try {
        const r = await (fal.subscribe as any)('fal-ai/face-swap', {
          input: {
            base_image_url: footballerBodyUrl,
            face_image_url: faceUrl,
          },
          pollInterval: 3000,
        });
        imageUrl = r?.data?.image?.url ?? r?.data?.images?.[0]?.url ?? r?.image?.url ?? r?.images?.[0]?.url;
        console.log('[face-swap]', imageUrl ? 'ok' : 'no image');
      } catch (e) {
        console.error('[face-swap] failed:', String(e).slice(0, 200));
      }
    }

    // ── FALLBACK: flux img2img at very low strength (keeps ~80% of original) ──
    if (!imageUrl) {
      try {
        const r = await (fal.subscribe as any)('fal-ai/flux/dev/image-to-image', {
          input: {
            image_url: faceUrl,
            prompt,
            strength: 0.20,
            num_inference_steps: 28,
            guidance_scale: 3.5,
            num_images: 1,
            enable_safety_checker: true,
          },
          pollInterval: 3000,
        });
        imageUrl = r?.data?.images?.[0]?.url ?? r?.images?.[0]?.url;
        console.log('[flux-img2img-fallback]', imageUrl ? 'ok' : 'no image');
      } catch (e) {
        console.error('[flux-img2img-fallback] failed:', String(e).slice(0, 200));
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
