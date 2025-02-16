from django.shortcuts import render

# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import google.generativeai as genai
from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

@csrf_exempt
def gemini_api_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            prompt = data.get("query", "")

            if prompt:
                model = genai.GenerativeModel("gemini-pro")
                response = model.generate_content(prompt)
                return JsonResponse({"response": response.text.strip() if response.text else "No response from Gemini."})
            else:
                return JsonResponse({"error": "Query cannot be empty"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)