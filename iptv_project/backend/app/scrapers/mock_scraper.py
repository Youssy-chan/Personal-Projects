import uuid
from typing import List
from datetime import datetime
from app.models.data_models import CatalogItem, StreamCandidate
from app.scrapers.base_scraper import BaseScraper

class MockScraper(BaseScraper):
    """
    A mock scraper that returns static dummy data for testing purposes.
    """
    async def fetch_catalog(self) -> List[CatalogItem]:
        return [
            CatalogItem(
                id="mock_ch_1",
                title="Mock Sports Channel",
                type="channel",
                category="Sports",
                logo="https://via.placeholder.com/150",
                resolver_status="ok"
            ),
            CatalogItem(
                id="mock_ev_1",
                title="Mock Live Match",
                type="event",
                category="Sports",
                sub_category="Football",
                start_time=datetime.utcnow(),
                resolver_status="ok"
            )
        ]

    async def fetch_item_page(self, item: CatalogItem) -> str:
        # Simulate returning HTML with an iframe and an m3u8 link
        return '''
        <html>
            <body>
                <iframe src="https://mock-embed.example.com/player?id=123"></iframe>
                <script>
                    var streamUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
                </script>
            </body>
        </html>
        '''

    async def extract_candidates(self, html: str, item: CatalogItem) -> List[StreamCandidate]:
        candidates = []
        
        # Mock finding an embed candidate
        candidates.append(StreamCandidate(
            stream_id=str(uuid.uuid4()),
            parent_id=item.id,
            url="https://mock-embed.example.com/player?id=123",
            format="embed",
            quality_hint="unknown"
        ))
        
        # Mock finding a direct HLS candidate
        candidates.append(StreamCandidate(
            stream_id=str(uuid.uuid4()),
            parent_id=item.id,
            url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            format="m3u8",
            quality_hint="1080p",
            headers={"Referer": "https://mock-site.example.com"}
        ))
        
        return candidates
