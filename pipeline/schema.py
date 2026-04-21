from dataclasses import dataclass
from datetime import datetime
from typing import Literal


Category = Literal["wedding", "interior"]
SourceType = Literal["public", "private_public_page", "user_generated"]


@dataclass
class RawRecord:
    source_name: str
    source_url: str
    source_type: SourceType
    collected_at: datetime
    payload: dict


@dataclass
class NormalizedCostRecord:
    category: Category
    region: str
    subtype: str
    scale_value: float
    scale_unit: Literal["guests", "py"]
    total_cost: int
    item_breakdown: dict
    source_name: str
    source_url: str
    confidence_score: float
    collected_at: datetime
