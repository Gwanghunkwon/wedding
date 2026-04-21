from statistics import median
from typing import Iterable

from schema import NormalizedCostRecord, RawRecord


def normalize(records: Iterable[RawRecord]) -> list[NormalizedCostRecord]:
    normalized: list[NormalizedCostRecord] = []
    for record in records:
        payload = record.payload
        if payload["category"] == "wedding":
            normalized.append(
                NormalizedCostRecord(
                    category="wedding",
                    region=payload["region"],
                    subtype=payload["subtype"],
                    scale_value=float(payload["guests"]),
                    scale_unit="guests",
                    total_cost=int(payload["total_cost"]),
                    item_breakdown=payload["items"],
                    source_name=record.source_name,
                    source_url=record.source_url,
                    confidence_score=0.85,
                    collected_at=record.collected_at,
                )
            )
        else:
            normalized.append(
                NormalizedCostRecord(
                    category="interior",
                    region=payload["region"],
                    subtype=payload["subtype"],
                    scale_value=float(payload["py"]),
                    scale_unit="py",
                    total_cost=int(payload["total_cost"]),
                    item_breakdown=payload["items"],
                    source_name=record.source_name,
                    source_url=record.source_url,
                    confidence_score=0.8,
                    collected_at=record.collected_at,
                )
            )
    return normalized


def remove_outliers(records: list[NormalizedCostRecord], threshold: float = 2.0) -> list[NormalizedCostRecord]:
    if len(records) < 3:
        return records

    costs = [record.total_cost for record in records]
    center = median(costs)
    filtered = [record for record in records if record.total_cost <= center * threshold]
    return filtered


def deduplicate(records: list[NormalizedCostRecord]) -> list[NormalizedCostRecord]:
    seen: set[tuple[str, str, str, float, int]] = set()
    unique: list[NormalizedCostRecord] = []
    for record in records:
        key = (record.category, record.region, record.subtype, record.scale_value, record.total_cost)
        if key in seen:
            continue
        seen.add(key)
        unique.append(record)
    return unique
