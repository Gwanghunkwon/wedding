import { summarizeEvents } from "@/lib/event-store";

const sourceHealth = [
  { source: "참가격", status: "정상", lastSyncedAt: "2026-04-20T22:00:00.000Z" },
  { source: "통계청", status: "정상", lastSyncedAt: "2026-04-21T01:30:00.000Z" },
  { source: "공개 후기 크롤러", status: "점검필요", lastSyncedAt: "2026-04-18T07:00:00.000Z" }
];

const outlierQueue = [
  { id: "oq-001", category: "wedding", reason: "동일 조건 대비 2.6배 금액", status: "대기" },
  { id: "oq-002", category: "interior", reason: "옵션비 비정상 비중", status: "검토중" }
];

export async function GET() {
  return Response.json({
    ok: true,
    data: {
      kpi: summarizeEvents(),
      sourceHealth,
      outlierQueue
    }
  });
}
