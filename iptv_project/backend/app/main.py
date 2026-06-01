from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.endpoints import router
from app.resolvers.stream_resolver import StreamResolver
from app.storage.cache import cache

resolver = StreamResolver()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initial load of the catalog using mock scraper for MVP
    try:
        from app.scrapers.mock_scraper import MockScraper
        scraper = MockScraper()
        catalog = await scraper.fetch_catalog()
        cache.update_catalog(catalog)
        
        # Pre-resolve streams for MVP convenience
        for item in catalog:
            candidates = await resolver.resolve_item(item)
            cache.update_streams(item.id, candidates)
    except Exception as e:
        print(f"Failed to load initial catalog: {e}")
        
    yield
    # Shutdown events here if needed

app = FastAPI(title="IPTV Backend Scraper & API", version="1.0.0", lifespan=lifespan)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
