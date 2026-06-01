import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_get_channels():
    # Since lifespan loads the mock catalog, it should not be empty
    with TestClient(app) as client:
        response = client.get("/channels")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        
def test_get_events():
    with TestClient(app) as client:
        response = client.get("/events/live")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

def test_playlist_generation():
    with TestClient(app) as client:
        response = client.get("/playlist/all.m3u")
        assert response.status_code == 200
        assert response.text.startswith("#EXTM3U")
