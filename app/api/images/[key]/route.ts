import { getImage } from "@/lib/imageStorage";

type RouteParams = {
  params: Promise<{ key: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { key } = await params;
  const image = await getImage(key);

  if (!image) {
    return new Response(null, { status: 404 });
  }

  // The URL carries a `?v=<updatedAt>` cache-buster, so the response itself
  // can be cached forever — a re-upload changes the URL, not this response.
  return new Response(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
