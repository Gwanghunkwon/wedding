export type WeddingCase = {
  id: string;
  region: "강남" | "강북" | "지방";
  venueType: "호텔" | "컨벤션" | "교회";
  guests: number;
  mealCost: number;
  hallCost: number;
  sdmCost: number;
  optionCost: number;
  totalCost: number;
  source: string;
};

export type InteriorCase = {
  id: string;
  region: "수도권" | "광역시" | "지방";
  areaPy: number;
  style: "모던" | "클래식" | "미니멀";
  scope: "전체" | "부분";
  unitCostPy: number;
  optionCost: number;
  totalCost: number;
  source: string;
};

export const weddingCases: WeddingCase[] = [
  {
    id: "w1",
    region: "강남",
    venueType: "호텔",
    guests: 200,
    mealCost: 20530000,
    hallCost: 7220000,
    sdmCost: 5200000,
    optionCost: 1700000,
    totalCost: 34660000,
    source: "참가격 공개 데이터"
  },
  {
    id: "w2",
    region: "강남",
    venueType: "컨벤션",
    guests: 180,
    mealCost: 16200000,
    hallCost: 5100000,
    sdmCost: 4300000,
    optionCost: 1400000,
    totalCost: 27000000,
    source: "사용자 실지불 등록"
  },
  {
    id: "w3",
    region: "지방",
    venueType: "호텔",
    guests: 170,
    mealCost: 10200000,
    hallCost: 3200000,
    sdmCost: 3700000,
    optionCost: 1000000,
    totalCost: 18100000,
    source: "제휴업체 표준 견적"
  }
];

export const interiorCases: InteriorCase[] = [
  {
    id: "i1",
    region: "수도권",
    areaPy: 24,
    style: "모던",
    scope: "전체",
    unitCostPy: 8700000,
    optionCost: 18000000,
    totalCost: 226800000,
    source: "업체 공개 정가표"
  },
  {
    id: "i2",
    region: "광역시",
    areaPy: 32,
    style: "미니멀",
    scope: "전체",
    unitCostPy: 7600000,
    optionCost: 22000000,
    totalCost: 265200000,
    source: "사용자 실지불 등록"
  },
  {
    id: "i3",
    region: "지방",
    areaPy: 34,
    style: "클래식",
    scope: "부분",
    unitCostPy: 4100000,
    optionCost: 12000000,
    totalCost: 151400000,
    source: "공개 후기 추출"
  }
];
