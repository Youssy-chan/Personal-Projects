from datetime import datetime
from typing import Optional, Dict
from pydantic import BaseModel, Field

class CatalogItem(BaseModel):
    id: str = Field(..., description="Unique identifier for the item")
    title: str = Field(..., description="Title of the channel or event")
    type: str = Field(..., description="Type: 'channel' or 'event'")
    category: str = Field(..., description="Primary category (e.g., Sports, News)")
    sub_category: Optional[str] = Field(None, description="Secondary category")
    logo: Optional[str] = Field(None, description="URL of the channel/event logo")
    start_time: Optional[datetime] = Field(None, description="Start time (for events)")
    end_time: Optional[datetime] = Field(None, description="End time (for events)")
    source_page: Optional[str] = Field(None, description="URL of the source page")
    resolver_status: str = Field("pending", description="Status: pending|ok|degraded|offline")

class StreamCandidate(BaseModel):
    stream_id: str = Field(..., description="Unique ID for this stream candidate")
    parent_id: str = Field(..., description="ID of the parent CatalogItem")
    url: str = Field(..., description="The URL of the stream (HLS, DASH, embed, etc.)")
    format: str = Field(..., description="Format: m3u8|mpd|embed|unknown")
    quality_hint: Optional[str] = Field(None, description="Hint: 1080p|720p|SD|unknown")
    language: Optional[str] = Field(None, description="Language code")
    headers: Dict[str, str] = Field(default_factory=dict, description="Required HTTP headers (User-Agent, Referer)")
    is_live: bool = Field(False, description="Whether the stream is currently live")
    latency_ms: Optional[int] = Field(None, description="Latency to fetch manifest in ms")
    status_code: Optional[int] = Field(None, description="HTTP status code when checking")
    score: int = Field(0, description="Quality score based on the scoring rules")
    checked_at: Optional[datetime] = Field(None, description="When the stream was last checked")
