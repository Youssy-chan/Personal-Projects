import requests
import xbmcaddon
import xbmc

ADDON = xbmcaddon.Addon()

class BackendAPI:
    def __init__(self):
        self.base_url = ADDON.getSetting('backend_url').rstrip('/')
        timeout_setting = ADDON.getSetting('timeout')
        self.timeout = int(timeout_setting) if timeout_setting else 10

    def get_channels(self):
        try:
            r = requests.get(f"{self.base_url}/channels", timeout=self.timeout)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            xbmc.log(f"API Error get_channels: {e}", xbmc.LOGERROR)
            return []

    def get_events(self):
        try:
            r = requests.get(f"{self.base_url}/events/live", timeout=self.timeout)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            xbmc.log(f"API Error get_events: {e}", xbmc.LOGERROR)
            return []

    def resolve_item(self, item_id):
        try:
            # First try to get cached streams
            r = requests.get(f"{self.base_url}/streams/{item_id}", timeout=self.timeout)
            if r.status_code == 200:
                return r.json()
            
            # If not found or empty, force resolve
            r = requests.post(f"{self.base_url}/resolve/{item_id}", timeout=self.timeout)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            xbmc.log(f"API Error resolve_item: {e}", xbmc.LOGERROR)
            return []
