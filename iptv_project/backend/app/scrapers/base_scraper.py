from abc import ABC, abstractmethod
from typing import List
from app.models.data_models import CatalogItem, StreamCandidate

class BaseScraper(ABC):
    @abstractmethod
    async def fetch_catalog(self) -> List[CatalogItem]:
        """Fetch the list of available channels and events."""
        pass

    @abstractmethod
    async def fetch_item_page(self, item: CatalogItem) -> str:
        """Fetch the raw HTML or JSON for a specific catalog item."""
        pass

    @abstractmethod
    async def extract_candidates(self, html: str, item: CatalogItem) -> List[StreamCandidate]:
        """Extract stream candidates from the raw page content."""
        pass
