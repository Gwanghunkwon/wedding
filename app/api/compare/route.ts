import { compareCosts } from "@/lib/pricing";
import { z } from "zod";

const querySchema = z.object({
  category: z.enum(["wedding", "interior"]),
  region: z.string().optional(),
  budget: z.coerce.number().optional(),
  guests: z.coerce.number().optional(),
  areaPy: z.coerce.number().optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    category: searchParams.get("category"),
    region: searchParams.get("region") ?? undefined,
    budget: searchParams.get("budget") ?? undefined,
    guests: searchParams.get("guests") ?? undefined,
    areaPy: searchParams.get("areaPy") ?? undefined
  });

  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const data = compareCosts(parsed.data);
  return Response.json({ ok: true, data });
}
