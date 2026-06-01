import urllib.parse
from resources.lib.listing import list_categories, list_channels, list_events
from resources.lib.playback import play_item

def route(argv):
    if len(argv) < 3 or not argv[2]:
        # No arguments, show categories
        list_categories()
        return

    # Parse args
    params = urllib.parse.parse_qs(argv[2][1:])
    action = params.get('action', [None])[0]

    if action == 'list_channels':
        list_channels()
    elif action == 'list_events':
        list_events()
    elif action == 'play_item':
        item_id = params.get('id', [None])[0]
        title = params.get('title', ['Unknown'])[0]
        play_item(item_id, title)
    else:
        list_categories()
