import { z } from "zod";
import { addEvent } from "@/lib/event-store";

type Lead = {
  id: string;
  category: "wedding" | "interior";
  customerName: string;
  budget: number;
  message: string;
  createdAt: string;
};

const leadSchema = z.object({
  category: z.enum(["wedding", "interior"]),
  customerName: z.string().min(2),
  budget: z.coerce.number().positive(),
  message: z.string().min(5)
});

const leadStore: Lead[] = [];

export async function GET() {
  return Response.json({ ok: true, data: leadStore });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const lead: Lead = {
    id: `lead-${leadStore.length + 1}`,
    ...parsed.data,
    createdAt: new Date().toISOString()
  };
  leadStore.push(lead);
  addEvent({
    name: "lead_submitted",
    category: parsed.data.category,
    source: "api"
  });
  return Response.json({ ok: true, data: lead }, { status: 201 });
}
