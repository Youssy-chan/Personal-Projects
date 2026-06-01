from typing import List
from app.models.data_models import CatalogItem, StreamCandidate
from app.validators.hls_validator import HLSValidator
from app.scrapers.base_scraper import BaseScraper
from app.scrapers.mock_scraper import MockScraper

class StreamResolver:
    def __init__(self):
        self.validator = HLSValidator()
        self.scrapers: List[BaseScraper] = [MockScraper()]

    async def resolve_item(self, item: CatalogItem) -> List[StreamCandidate]:
        """
        Extract stream candidates using all available scrapers,
        validate them, score them, and return the sorted list.
        """
        all_candidates = []
        
        for scraper in self.scrapers:
            try:
                html = await scraper.fetch_item_page(item)
                candidates = await scraper.extract_candidates(html, item)
                all_candidates.extend(candidates)
            except Exception as e:
                # Log error and continue with other scrapers
                print(f"Error scraping with {scraper.__class__.__name__}: {e}")
        
        validated_candidates = []
        for candidate in all_candidates:
            validated = await self.validator.validate(candidate)
            validated_candidates.append(validated)
            
        # Sort by score descending
        validated_candidates.sort(key=lambda x: x.score, reverse=True)
        
        # Keep at most top 5
        return validated_candidates[:5]
