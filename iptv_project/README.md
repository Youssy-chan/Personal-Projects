# IPTV Backend Scraper & Kodi Add-on

A modular system to fetch, validate, and serve Live TV and Sports streams via an automated M3U generator and a companion Kodi Add-on.

## Structure
- `backend/`: FastAPI application that acts as the scraping and validation engine.
- `kodi.addon.example/`: A basic Kodi addon UI that communicates with the backend.

## Backend Setup (Local)
1. Navigate to `backend/`: `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Activate venv: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Copy configuration: `cp .env.example .env`
6. Run the server: `uvicorn app.main:app --reload`
7. Access Swagger UI at `http://127.0.0.1:8000/docs`.

## Backend Setup (Docker)
1. Navigate to `backend/`: `cd backend`
2. Run `docker-compose up --build -d`

## API Endpoints
- `/health`: System status
- `/channels`: List of channels
- `/events/live`: List of live events
- `/playlist/all.m3u`: HLS Validated M3U playlist 

## Kodi Add-on Installation
1. Zip the `kodi.addon.example` folder (make sure `addon.xml` is at the root of the zip).
2. Open Kodi -> Add-ons -> Install from zip file.
3. Once installed, configure the "Backend URL" in the Add-on Settings if your backend is not running on `localhost:8000`.

## Testing
Run `pytest tests/` from the `backend/` directory.

## Future Customization
To add your own sources, implement a new scraper inheriting from `app.scrapers.base_scraper.BaseScraper` and add it to the `StreamResolver` in `app/resolvers/stream_resolver.py`.
