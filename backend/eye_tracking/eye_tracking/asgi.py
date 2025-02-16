import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from streaming.routing import websocket_urlpatterns  # Import WebSocket routes

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "eye_tracking.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(websocket_urlpatterns),  # Enable WebSocket handling
})