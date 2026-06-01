import time
import m3u8
import httpx
from datetime import datetime
from app.models.data_models import StreamCandidate
from app.core.config import settings

class HLSValidator:
    def __init__(self):
        self.timeout = settings.REQUEST_TIMEOUT
        self.user_agent = settings.DEFAULT_USER_AGENT

    async def validate(self, candidate: StreamCandidate) -> StreamCandidate:
        candidate.checked_at = datetime.utcnow()
        
        if candidate.format != "m3u8":
            # For non-HLS streams (like embed), we can't easily validate the manifest.
            # We just apply base score rules.
            candidate.score = self._calculate_score(candidate, None)
            return candidate

        headers = {"User-Agent": self.user_agent}
        if candidate.headers:
            headers.update(candidate.headers)

        start_time = time.time()
        try:
            async with httpx.AsyncClient(verify=settings.VERIFY_SSL, timeout=self.timeout) as client:
                response = await client.get(candidate.url, headers=headers)
                candidate.status_code = response.status_code
                candidate.latency_ms = int((time.time() - start_time) * 1000)

                if response.status_code == 200:
                    try:
                        manifest = m3u8.loads(response.text)
                        candidate.score = self._calculate_score(candidate, manifest)
                    except Exception:
                        # Manifest unparseable
                        candidate.score = self._calculate_score(candidate, None)
                else:
                    candidate.score = self._calculate_score(candidate, None)
        except Exception:
            # Network error or timeout
            candidate.status_code = 0
            candidate.latency_ms = int((time.time() - start_time) * 1000)
            candidate.score = self._calculate_score(candidate, None, error=True)

        return candidate

    def _calculate_score(self, candidate: StreamCandidate, manifest: m3u8.M3U8 | None, error: bool = False) -> int:
        score = 0
        
        # +40 se url HLS (.m3u8)
        if candidate.format == "m3u8":
            score += 40
            
        # -20 se solo iframe/embed non risolto
        if candidate.format == "embed":
            score -= 20
            
        # -15 se timeout o redirect anomali
        if error or (candidate.status_code and candidate.status_code >= 400):
            score -= 15
            
        # +10 se status 200
        if candidate.status_code == 200:
            score += 10
            
        # +5 se ha referer/header corretti (basic check)
        if "Referer" in candidate.headers:
            score += 5
            
        if manifest:
            # +15 se manifest parseable
            score += 15
            
            # +10 se media playlist live valida
            if manifest.is_variant:
                # Master playlist: we assume it's valid if it parsed
                score += 10
            elif manifest.target_duration:
                # Media playlist
                candidate.is_live = not manifest.is_endlist
                if candidate.is_live:
                    score += 10

        # +10 se latenza < 2s
        if candidate.latency_ms is not None and candidate.latency_ms < 2000:
            score += 10

        return score
