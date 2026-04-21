from schema import RawRecord


BLOCKED_KEYWORDS = ["private", "members", "login", "cafe.naver.com"]
ALLOWED_SOURCE_TYPES = {"public", "private_public_page", "user_generated"}


def validate_source_policy(records: list[RawRecord]) -> list[str]:
    violations: list[str] = []
    for record in records:
        if record.source_type not in ALLOWED_SOURCE_TYPES:
            violations.append(f"[{record.source_name}] 허용되지 않은 source_type: {record.source_type}")
        lowered_url = record.source_url.lower()
        if any(keyword in lowered_url for keyword in BLOCKED_KEYWORDS):
            violations.append(f"[{record.source_name}] 정책상 차단 키워드 포함 URL: {record.source_url}")
    return violations
