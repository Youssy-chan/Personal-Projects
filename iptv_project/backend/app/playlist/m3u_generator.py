from typing import List, Dict
from app.models.data_models import CatalogItem, StreamCandidate

class M3UGenerator:
    def generate(self, catalog: List[CatalogItem], streams_map: Dict[str, List[StreamCandidate]], sports_only: bool = False, include_backups: bool = False) -> str:
        """
        Generate M3U playlist.
        streams_map maps CatalogItem.id to a list of sorted StreamCandidates.
        """
        lines = ["#EXTM3U"]
        
        for item in catalog:
            if sports_only and item.category.lower() != "sports":
                continue
                
            candidates = streams_map.get(item.id, [])
            if not candidates:
                continue
                
            # Filter valid candidates (score > 0 as a basic rule, or just top 1/all)
            valid_candidates = [c for c in candidates if c.score > -20]
            if not valid_candidates:
                continue

            # Best stream
            best_stream = valid_candidates[0]
            lines.extend(self._create_entry(item, best_stream, ""))
            
            # Backups
            if include_backups and len(valid_candidates) > 1:
                for idx, backup_stream in enumerate(valid_candidates[1:3], 1):
                    lines.extend(self._create_entry(item, backup_stream, f" (Backup {idx})"))
                    
        return "\n".join(lines)
        
    def _create_entry(self, item: CatalogItem, stream: StreamCandidate, title_suffix: str) -> List[str]:
        lines = []
        
        # Build EXTINF
        logo_attr = f' tvg-logo="{item.logo}"' if item.logo else ""
        extinf = f'#EXTINF:-1 tvg-id="{item.id}" tvg-name="{item.title}"{logo_attr} group-title="{item.category}",{item.title}{title_suffix}'
        lines.append(extinf)
        
        # Build EXTVLCOPT
        if "User-Agent" in stream.headers:
            lines.append(f'#EXTVLCOPT:http-user-agent={stream.headers["User-Agent"]}')
        if "Referer" in stream.headers:
            lines.append(f'#EXTVLCOPT:http-referrer={stream.headers["Referer"]}')
            
        # URL
        lines.append(stream.url)
        return lines
