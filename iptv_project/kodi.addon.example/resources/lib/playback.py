import sys
import xbmcgui
import xbmcplugin
import xbmcaddon
from resources.lib.api_client import BackendAPI

ADDON = xbmcaddon.Addon()

def play_item(item_id, title):
    handle = int(sys.argv[1])
    api = BackendAPI()
    
    xbmcgui.Dialog().notification(ADDON.getAddonInfo('name'), f"Resolving {title}...", xbmcgui.NOTIFICATION_INFO, 2000)
    
    streams = api.resolve_item(item_id)
    if not streams:
        xbmcgui.Dialog().notification("Error", "No streams found or backend offline", xbmcgui.NOTIFICATION_ERROR, 3000)
        xbmcplugin.setResolvedUrl(handle, False, xbmcgui.ListItem())
        return

    # Filter out embedded non-HLS ones for Kodi direct playback if needed
    # But for MVP we'll just try the top scored stream
    best_stream = streams[0]
    
    # Set headers if needed
    play_url = best_stream['url']
    if best_stream.get('headers'):
        headers = []
        for k, v in best_stream['headers'].items():
            headers.append(f"{k}={v}")
        if headers:
            play_url += "|" + "&".join(headers)
            
    list_item = xbmcgui.ListItem(path=play_url)
    list_item.setProperty('IsPlayable', 'true')
    list_item.setInfo('video', {'title': title})
    
    # Fallback could be handled by a player monitor, but for a basic setResolvedUrl we just pass the best one
    xbmcplugin.setResolvedUrl(handle, True, list_item)
