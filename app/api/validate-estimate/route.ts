import { z } from "zod";
import { compareCosts } from "@/lib/pricing";

const bodySchema = z.object({
  category: z.enum(["wedding", "interior"]),
  text: z.string().min(10)
});

const weddingKeywords = ["식대", "대관", "스드메", "드레스", "메이크업", "장식"];
const interiorKeywords = ["철거", "목공", "도배", "타일", "조명", "가구", "옵션"];

function parseAmounts(text: string) {
  const values: number[] = [];
  const tenThousandWonMatches = text.matchAll(/(\d[\d,]*)\s*만원/g);
  for (const match of tenThousandWonMatches) {
    values.push(Number(match[1].replaceAll(",", "")) * 10000);
  }

  const wonMatches = text.matchAll(/(\d[\d,]*)\s*원/g);
  for (const match of wonMatches) {
    values.push(Number(match[1].replaceAll(",", "")));
  }
  return values.filter((value) => Number.isFinite(value) && value > 0);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const text = parsed.data.text;
  const keywords = parsed.data.category === "wedding" ? weddingKeywords : interiorKeywords;
  const missing = keywords.filter((keyword) => !text.includes(keyword));

  const warnings: string[] = [];
  if (missing.length) {
    warnings.push(`핵심 항목 누락 가능성: ${missing.slice(0, 3).join(", ")}`);
  }
  if (text.includes("별도") || text.includes("추후 협의")) {
    warnings.push("추가 비용이 발생할 수 있는 문구(별도/추후 협의)를 확인하세요.");
  }
  if (text.includes("%") || text.includes("할인")) {
    warnings.push("할인 조건의 적용 범위(세금/부가서비스 포함 여부)를 확인하세요.");
  }

  const amounts = parseAmounts(text);
  const parsedTotal = amounts.reduce((sum, value) => sum + value, 0);
  const baseline = compareCosts({ category: parsed.data.category }).averageTotal;
  if (parsedTotal > 0 && baseline > 0 && parsedTotal > baseline * 1.25) {
    warnings.push(`입력 금액 합계가 평균 대비 높습니다. (입력합 ${parsedTotal.toLocaleString("ko-KR")}원 / 평균 ${baseline.toLocaleString("ko-KR")}원)`);
  }

  return Response.json({
    ok: true,
    data: {
      confidence: Math.max(30, 100 - missing.length * 10),
      warnings,
      parsedTotal,
      analyzedKeywords: keywords.length - missing.length,
      totalKeywords: keywords.length
    }
  });
}
