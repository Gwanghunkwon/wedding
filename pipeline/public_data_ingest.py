from datetime import datetime
from schema import RawRecord


def fetch_public_wedding_samples() -> list[RawRecord]:
  samples = [
      RawRecord(
          source_name="참가격",
          source_url="https://www.price.go.kr",
          source_type="public",
          collected_at=datetime.utcnow(),
          payload={
              "category": "wedding",
              "region": "강남",
              "subtype": "호텔",
              "guests": 200,
              "total_cost": 34660000,
              "items": {
                  "meal_cost": 20530000,
                  "hall_cost": 7220000,
                  "sdm_cost": 5200000,
                  "option_cost": 1700000,
              },
          },
      )
  ]
  return samples


def fetch_public_interior_samples() -> list[RawRecord]:
  samples = [
      RawRecord(
          source_name="공개 업체 정가표",
          source_url="https://example.com/interior-price",
          source_type="public",
          collected_at=datetime.utcnow(),
          payload={
              "category": "interior",
              "region": "수도권",
              "subtype": "모던",
              "py": 32,
              "total_cost": 250000000,
              "items": {"unit_cost_py": 7600000, "option_cost": 22000000},
          },
      )
  ]
  return samples
