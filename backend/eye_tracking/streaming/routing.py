from django.urls import re_path
from streaming.consumers import MyConsumer, TextConsumer   # Ensure this matches your consumer class

websocket_urlpatterns = [
    re_path(r"ws/stream/image/$", MyConsumer.as_asgi()),  # Replace "some_path" with your actual WebSocket route
    re_path(r"ws/stream/text/$", TextConsumer.as_asgi()),  # Text processing

]