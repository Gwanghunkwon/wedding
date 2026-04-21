from normalize import deduplicate, normalize, remove_outliers
from public_data_ingest import fetch_public_interior_samples, fetch_public_wedding_samples
from source_policy import validate_source_policy


def run() -> None:
    raw = fetch_public_wedding_samples() + fetch_public_interior_samples()
    violations = validate_source_policy(raw)
    if violations:
        print("policy_violations:")
        for violation in violations:
            print(f"- {violation}")
        return

    normalized = normalize(raw)
    normalized = deduplicate(normalized)
    normalized = remove_outliers(normalized)

    print(f"raw={len(raw)} normalized={len(normalized)}")
    for row in normalized:
        print(
            {
                "category": row.category,
                "region": row.region,
                "subtype": row.subtype,
                "total_cost": row.total_cost,
                "confidence": row.confidence_score,
            }
        )


if __name__ == "__main__":
    run()
