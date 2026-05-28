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
    const body = await req.json() as { prompt?: string; userImageDataUrl?: string };
    const { prompt, userImageDataUrl } = body;
    if (!prompt) return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });

    // ── PuLID: face-consistent generation (user photo provided) ──
    if (userImageDataUrl) {
      // Convert base64 dataUrl to Blob and upload to fal.ai CDN
      const base64 = userImageDataUrl.replace(/^data:image\/\w+;base64,/, '');
      const mimeMatch = userImageDataUrl.match(/^data:(image\/\w+);base64,/);
      const mimeType = (mimeMatch?.[1] ?? 'image/jpeg') as string;
      const buffer = Buffer.from(base64, 'base64');
      const blob = new Blob([buffer], { type: mimeType });

      const faceUrl = await (fal.storage as any).upload(blob);
      console.log('[pulid] face uploaded:', faceUrl);

      const r = await (fal.subscribe as any)('fal-ai/flux-pulid', {
        input: {
          prompt,
          reference_image_url: faceUrl,
          image_size: 'portrait_4_3',
          num_inference_steps: 35,
          guidance_scale: 4.5,
          id_weight: 0.85,
          true_cfg: 1,
          negative_prompt: 'ugly, blurry, distorted, cartoon, extra limbs, bad anatomy, watermark, text, low quality, deformed face, unnatural skin',
          enable_safety_checker: true,
        },
        pollInterval: 3000,
      });

      const imageUrl: string | undefined = r?.data?.images?.[0]?.url ?? r?.images?.[0]?.url;
      console.log('[pulid]', imageUrl ? 'ok' : 'no image');

      if (!imageUrl) return NextResponse.json({ error: 'No image from flux-pulid' }, { status: 502 });
      return NextResponse.json({ imageUrl });
    }

    // ── Fallback: pure text-to-image (no face reference) ──
    const r = await (fal.subscribe as any)('fal-ai/flux/dev', {
      input: {
        prompt,
        negative_prompt: 'ugly, blurry, distorted, cartoon, extra limbs, bad anatomy, watermark, text, low quality',
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
