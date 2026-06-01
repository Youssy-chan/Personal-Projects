import sys
import xbmcgui
import xbmcplugin
import urllib.parse
from resources.lib.api_client import BackendAPI

def list_categories():
    handle = int(sys.argv[1])
    
    # Live TV
    list_item = xbmcgui.ListItem(label="Live TV")
    url = f"{sys.argv[0]}?action=list_channels"
    xbmcplugin.addDirectoryItem(handle, url, list_item, isFolder=True)
    
    # Sports Events
    list_item = xbmcgui.ListItem(label="Live Sports")
    url = f"{sys.argv[0]}?action=list_events"
    xbmcplugin.addDirectoryItem(handle, url, list_item, isFolder=True)
    
    xbmcplugin.endOfDirectory(handle)

def list_channels():
    handle = int(sys.argv[1])
    api = BackendAPI()
    channels = api.get_channels()
    
    for ch in channels:
        list_item = xbmcgui.ListItem(label=ch.get('title', 'Unknown'))
        if ch.get('logo'):
            list_item.setArt({'thumb': ch['logo'], 'icon': ch['logo']})
        
        list_item.setInfo('video', {'title': ch.get('title'), 'genre': ch.get('category')})
        url = f"{sys.argv[0]}?action=play_item&id={urllib.parse.quote(ch['id'])}&title={urllib.parse.quote(ch['title'])}"
        xbmcplugin.addDirectoryItem(handle, url, list_item, isFolder=False)
        
    xbmcplugin.endOfDirectory(handle)

def list_events():
    handle = int(sys.argv[1])
    api = BackendAPI()
    events = api.get_events()
    
    for ev in events:
        title = ev.get('title', 'Unknown')
        list_item = xbmcgui.ListItem(label=title)
        if ev.get('logo'):
            list_item.setArt({'thumb': ev['logo'], 'icon': ev['logo']})
            
        list_item.setInfo('video', {'title': title, 'genre': ev.get('category')})
        url = f"{sys.argv[0]}?action=play_item&id={urllib.parse.quote(ev['id'])}&title={urllib.parse.quote(title)}"
        xbmcplugin.addDirectoryItem(handle, url, list_item, isFolder=False)
        
    xbmcplugin.endOfDirectory(handle)
