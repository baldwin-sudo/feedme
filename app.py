from flask import Flask, request, jsonify
import openai
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)
# Replace 'your_openai_api_key' with your actual OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/suggest_recipes', methods=['POST'])
def suggest_recipes():
    data = request.json

    # Extract user inputs
    mood = data.get('mood', '')
    day_description = data.get('day_description', '')
    ingredients = data.get('ingredients', [])
    cuisine = data.get('cuisine', 'Moroccan')  # Default to Moroccan if not provided

    # Create a prompt for OpenAI
    prompt = (
        f"You are a helpful recipe assistant. Based on the information provided below, "
        f"suggest a list of suitable meals or drinks that match the user's mood and preferences. "
        f"The recommendations should be simple and easy to make and do not need to include all the ingredients necessarily. "
        f"Provide at least three options for the user to choose from, including brief descriptions of each option.\n\n"
        f"User Input:\n"
        f"- Mood: {mood}\n"
        f"- Day Type: {day_description}\n"
        f"- Available Ingredients: {', '.join(ingredients)}\n"
        f"- Preferred Cuisine: {cuisine}\n"  # Include cuisine in the prompt
        f"Recommendation:"
    )

    try:
        # Call the OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150
        )

        suggestions = response['choices'][0]['message']['content'].strip()
        return jsonify({"suggestions": suggestions.splitlines()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
      app.run(debug=True, host='0.0.0.0')
