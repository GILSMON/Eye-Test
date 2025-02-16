from django.urls import re_path
from streaming.consumers import MyConsumer  # Ensure this matches your consumer class

websocket_urlpatterns = [
    re_path(r"ws/stream/$", MyConsumer.as_asgi()),  # Replace "some_path" with your actual WebSocket route
]