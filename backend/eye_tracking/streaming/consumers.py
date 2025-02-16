import json
from channels.generic.websocket import AsyncWebsocketConsumer

import cv2
import numpy as np

import base64
from io import BytesIO
from PIL import Image
from channels.generic.websocket import AsyncWebsocketConsumer
from eye_tracking.processor import process_frame # Import the function from the processor.py file
from eye_tracking.gemini_response import get_gemini_response 


class MyConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        await self.accept()
        print("WebSocket Connected")

    async def receive(self, text_data=None, bytes_data=None):
        try:
            if bytes_data:
                print("Received binary image data")  # Debug log

                # Convert binary data to an image
                image = Image.open(BytesIO(bytes_data))
                image = image.convert("RGB")  # Ensure it's in RGB mode

                # Convert PIL image to OpenCV format
                open_cv_image = np.array(image)
                open_cv_image = cv2.cvtColor(open_cv_image, cv2.COLOR_RGB2BGR)
                open_cv_image = cv2.flip(open_cv_image, 1)  # Flip image

                # Process frame with MediaPipe
                status, processed_image = process_frame(open_cv_image)
                pil_processed = Image.fromarray(cv2.cvtColor(processed_image, cv2.COLOR_BGR2RGB))
                buffered = BytesIO()
                pil_processed.save(buffered, format="JPEG")

                processed_bytes = buffered.getvalue()
                processed_base64 = base64.b64encode(processed_bytes).decode("utf-8")

                
                print(f"Sending processed image: {status}")  # Debug log
                await self.send(text_data=json.dumps({
                    "status": status,
                    "image": processed_base64
                }))

            elif text_data:
                print("Received text data:", text_data)  # Debugging for text messages

        except Exception as e:
            print("Error:", str(e))  # Debugging unexpected errors
            await self.send(text_data=json.dumps({"error": str(e)}))

    async def disconnect(self, close_code):
        print("WebSocket Disconnected")

class TextConsumer(AsyncWebsocketConsumer):
    """Handles text processing with Gemini API."""
    
    async def receive(self, text_data=None):
        request_data = json.loads(text_data)
        
        if request_data.get("type") == "text_query":
            user_input = request_data.get("query", "")
            print(f"Received request data: {request_data}")  # Debug log

            response = await get_gemini_response(user_input)  # Now calling the function from gemini_response.py
           
            print(f"Sending response: {response}")  # Debug log

            await self.send(text_data=json.dumps({
                "type": "text_response",
                "response": response
            }))

    async def disconnect(self, close_code):
        print("WebSocket Disconnected")
    