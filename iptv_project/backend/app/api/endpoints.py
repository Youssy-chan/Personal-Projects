from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import PlainTextResponse
from typing import List
from app.storage.cache import cache
from app.models.data_models import CatalogItem, StreamCandidate
from app.resolvers.stream_resolver import StreamResolver
from app.playlist.m3u_generator import M3UGenerator

router = APIRouter()
resolver = StreamResolver()
m3u_gen = M3UGenerator()

@router.get("/health")
async def health_check():
    return {"status": "ok", "uptime_info": "system is running"}

@router.get("/channels", response_model=List[CatalogItem])
async def get_channels():
    # If cache is empty, we might trigger a fetch here, but usually a background task does it
    items = cache.get_catalog()
    return [i for i in items if i.type == "channel"]

@router.get("/events/live", response_model=List[CatalogItem])
async def get_live_events():
    items = cache.get_catalog()
    return [i for i in items if i.type == "event"]

@router.get("/streams/{id}", response_model=List[StreamCandidate])
async def get_streams(id: str):
    streams = cache.get_streams(id)
    if not streams:
        raise HTTPException(status_code=404, detail="Streams not resolved or found yet. Try /resolve/{id} first.")
    return streams

@router.post("/resolve/{id}", response_model=List[StreamCandidate])
async def resolve_item(id: str):
    items = cache.get_catalog()
    item = next((i for i in items if i.id == id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in catalog")
    
    candidates = await resolver.resolve_item(item)
    cache.update_streams(item.id, candidates)
    return candidates

@router.get("/playlist/all.m3u", response_class=PlainTextResponse)
async def get_playlist_all():
    catalog = cache.get_catalog()
    streams_map = cache.get_all_streams_map()
    return m3u_gen.generate(catalog, streams_map, sports_only=False, include_backups=False)

@router.get("/playlist/sports.m3u", response_class=PlainTextResponse)
async def get_playlist_sports():
    catalog = cache.get_catalog()
    streams_map = cache.get_all_streams_map()
    return m3u_gen.generate(catalog, streams_map, sports_only=True, include_backups=False)

@router.get("/playlist/backup.m3u", response_class=PlainTextResponse)
async def get_playlist_backup():
    catalog = cache.get_catalog()
    streams_map = cache.get_all_streams_map()
    return m3u_gen.generate(catalog, streams_map, sports_only=False, include_backups=True)

@router.get("/stats")
async def get_stats():
    return {
        "catalog_size": len(cache.get_catalog()),
        "resolved_items": len(cache.get_all_streams_map()),
        "last_catalog_update": cache.last_catalog_update
    }
