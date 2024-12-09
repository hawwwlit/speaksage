from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv
import logging
import sys

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure OpenAI
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Configure Flask logger to write to stdout
app.logger.handlers = []
app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.DEBUG)  # Set to DEBUG to see all logs

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/enhance', methods=['POST'])
def enhance_text():
    try:
        data = request.json
        text = data.get('text', '')
        translate = data.get('translate', False)
        improve_grammar = data.get('improveGrammar', False)
        improve_flow = data.get('improveFlow', False)
        additional_requests = data.get('additionalRequests', '')

        current_text = text
        
        # First handle translation if needed
        if translate:
            translation_prompt = "Translate the following Chinese to English:\n\n" + current_text
            translation_response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "user", "content": translation_prompt}
                ],
                temperature=0.3,
                max_tokens=1000
            )
            current_text = translation_response.choices[0].message.content
        app.logger.debug(f"Translated text: {current_text}")
        
        # Then handle grammar and flow improvements if needed
        if improve_grammar or improve_flow or additional_requests:
            prompt = "Rephrase the following"
            if improve_grammar and improve_flow:
                prompt += " to improve the grammar and flow"
            elif improve_grammar:
                prompt += " to improve the grammar"
            elif improve_flow:
                prompt += " to improve the flow"
            
            if additional_requests:
                prompt += f" with the following additional requirements: {additional_requests}"
            
            prompt += f":\n\n{current_text}"
        else:
            prompt = current_text

        app.logger.debug(f"Generated prompt: \n{prompt}")
        enhancement_response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        current_text = enhancement_response.choices[0].message.content

        return jsonify({"success": True, "enhancedText": current_text})

    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True) 