from typing import List, Dict, Optional
from datetime import datetime
from app.models.data_models import CatalogItem, StreamCandidate

class InMemoryCache:
    def __init__(self):
        self.catalog: List[CatalogItem] = []
        self.streams: Dict[str, List[StreamCandidate]] = {}
        self.last_catalog_update: Optional[datetime] = None

    def update_catalog(self, catalog: List[CatalogItem]):
        self.catalog = catalog
        self.last_catalog_update = datetime.utcnow()

    def get_catalog(self) -> List[CatalogItem]:
        return self.catalog

    def update_streams(self, item_id: str, candidates: List[StreamCandidate]):
        self.streams[item_id] = candidates

    def get_streams(self, item_id: str) -> List[StreamCandidate]:
        return self.streams.get(item_id, [])

    def get_all_streams_map(self) -> Dict[str, List[StreamCandidate]]:
        return self.streams

# Global cache instance
cache = InMemoryCache()
