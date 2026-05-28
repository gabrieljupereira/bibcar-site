import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) {
    return NextResponse.json({ error: 'FAL_KEY not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { imageDataUrl, prompt } = body as { imageDataUrl: string; prompt: string };

    if (!imageDataUrl || !prompt) {
      return NextResponse.json({ error: 'Missing imageDataUrl or prompt' }, { status: 400 });
    }

    // Submit job to fal.ai flux/dev/image-to-image
    const submitRes = await fetch('https://queue.fal.run/fal-ai/flux/dev/image-to-image', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageDataUrl,
        prompt,
        strength: 0.82,
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });

    if (!submitRes.ok) {
      const err = await submitRes.text();
      return NextResponse.json({ error: `fal.ai submit error: ${err}` }, { status: 502 });
    }

    const submitData = await submitRes.json() as { request_id: string; status_url: string; response_url: string };
    const { request_id, response_url } = submitData;

    // Poll for result (max 120s)
    const start = Date.now();
    while (Date.now() - start < 120_000) {
      await new Promise(r => setTimeout(r, 3000));

      const statusRes = await fetch(
        `https://queue.fal.run/fal-ai/flux/dev/image-to-image/requests/${request_id}/status`,
        { headers: { 'Authorization': `Key ${FAL_KEY}` } }
      );
      const status = await statusRes.json() as { status: string };

      if (status.status === 'COMPLETED') {
        const resultRes = await fetch(response_url, {
          headers: { 'Authorization': `Key ${FAL_KEY}` },
        });
        const result = await resultRes.json() as { images?: { url: string }[] };
        const imageUrl = result.images?.[0]?.url;
        if (!imageUrl) {
          return NextResponse.json({ error: 'No image in result' }, { status: 502 });
        }
        return NextResponse.json({ imageUrl });
      }

      if (status.status === 'FAILED') {
        return NextResponse.json({ error: 'Generation failed' }, { status: 502 });
      }
    }

    return NextResponse.json({ error: 'Timeout waiting for result' }, { status: 504 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
