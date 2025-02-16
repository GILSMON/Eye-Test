import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables (Optional: If using an .env file)
load_dotenv()

# Set up the Gemini API key
API_KEY = os.getenv("GEMINI_API_KEY")  # Ensure this is set in your .env file
genai.configure(api_key=API_KEY)



# Function to get response from Gemini
async def get_gemini_response(user_input):
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(user_input)
        print(response)
        if response and response.text:
            return response.text.strip()
        else:
            return "No response from Gemini."
    except Exception as e:
        print(f"Error in Gemini API call: {e}")
        return "An error occurred while fetching the response."