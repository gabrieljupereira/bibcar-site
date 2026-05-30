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

    // ── Two-step: flux/dev generates footballer → face-swap places real face ──
    // PuLID is probabilistic and has a ceiling on identity fidelity.
    // face-swap copies the face pixel-for-pixel, guaranteeing likeness.
    if (userImageDataUrl) {
      // Upload user face crop to fal CDN
      const base64 = userImageDataUrl.replace(/^data:image\/\w+;base64,/, '');
      const mimeMatch = userImageDataUrl.match(/^data:(image\/\w+);base64,/);
      const mimeType = (mimeMatch?.[1] ?? 'image/jpeg') as string;
      const buffer = Buffer.from(base64, 'base64');
      const blob = new Blob([buffer], { type: mimeType });

      const faceUrl = await (fal.storage as any).upload(blob);
      console.log('[step1] face uploaded:', faceUrl);

      // Step 1: generate a perfect footballer with text-to-image (always high quality)
      const t2iRes = await (fal.subscribe as any)('fal-ai/flux/dev', {
        input: {
          prompt,
          num_inference_steps: 28,
          guidance_scale: 3.5,
          image_size: 'portrait_4_3',
          enable_safety_checker: true,
        },
        pollInterval: 2000,
      });

      const footballerUrl: string | undefined = t2iRes?.data?.images?.[0]?.url ?? t2iRes?.images?.[0]?.url;
      console.log('[step1] footballer:', footballerUrl ? 'ok' : 'no image');
      if (!footballerUrl) return NextResponse.json({ error: 'No footballer image from flux' }, { status: 502 });

      // Step 2: swap the user's real face onto the generated footballer
      const swapRes = await (fal.subscribe as any)('fal-ai/face-swap', {
        input: {
          source_image_url: faceUrl,       // user face (to extract from)
          target_image_url: footballerUrl, // footballer body (where to put it)
        },
        pollInterval: 2000,
      });

      const imageUrl: string | undefined =
        swapRes?.data?.image?.url ??
        swapRes?.data?.images?.[0]?.url ??
        swapRes?.image?.url;
      console.log('[step2] face-swap:', imageUrl ? 'ok' : 'no image');

      if (!imageUrl) return NextResponse.json({ error: 'No image from face-swap' }, { status: 502 });
      return NextResponse.json({ imageUrl });
    }

    // ── Fallback: pure text-to-image (no face reference) ──
    const r = await (fal.subscribe as any)('fal-ai/flux/dev', {
      input: {
        prompt,
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
