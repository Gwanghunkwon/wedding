from collections import Counter
from dataclasses import asdict
from datetime import datetime, timedelta

from normalize import deduplicate, normalize, remove_outliers
from public_data_ingest import fetch_public_interior_samples, fetch_public_wedding_samples


def build_quality_report() -> dict:
    raw = fetch_public_wedding_samples() + fetch_public_interior_samples()
    normalized = normalize(raw)
    deduped = deduplicate(normalized)
    cleaned = remove_outliers(deduped)

    source_counter = Counter(row.source_name for row in cleaned)
    category_counter = Counter(row.category for row in cleaned)
    stale_threshold = datetime.utcnow() - timedelta(days=14)
    stale_count = sum(1 for row in cleaned if row.collected_at < stale_threshold)

    return {
        "raw_count": len(raw),
        "normalized_count": len(normalized),
        "deduped_count": len(deduped),
        "cleaned_count": len(cleaned),
        "source_distribution": dict(source_counter),
        "category_distribution": dict(category_counter),
        "stale_count": stale_count,
        "sample_rows": [asdict(row) for row in cleaned[:3]],
    }


if __name__ == "__main__":
    report = build_quality_report()
    print(report)
