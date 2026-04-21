import { addEvent, listEvents } from "@/lib/event-store";
import { z } from "zod";

const eventSchema = z.object({
  name: z.enum(["compare_started", "compare_result_viewed", "lead_submitted", "lead_answered", "contract_case_uploaded"]),
  category: z.enum(["wedding", "interior", "common"]).default("common"),
  source: z.enum(["web", "api", "b2b"]).default("web")
});

export async function GET() {
  return Response.json({ ok: true, data: listEvents() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const event = addEvent(parsed.data);
  return Response.json({ ok: true, data: event }, { status: 201 });
}
