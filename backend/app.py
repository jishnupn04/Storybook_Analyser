
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from transformers import AutoProcessor, AutoModelForImageTextToText, AutoTokenizer, AutoModelForCausalLM
from transformers import BlipProcessor, BlipForConditionalGeneration, T5Tokenizer, T5ForConditionalGeneration
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)

blip_processor = AutoProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = AutoModelForImageTextToText.from_pretrained("Salesforce/blip-image-captioning-base")
storyt5_model = AutoModelForCausalLM.from_pretrained("distilgpt2")
storyt5_tokenizer = AutoTokenizer.from_pretrained("distilgpt2")

def analyze_image(image_data):
    try:
        if 'base64,' in image_data:
            image_data = image_data.split('base64,')[1]
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        inputs = blip_processor(image, return_tensors="pt")
        out = blip_model.generate(**inputs,max_new_tokens=60)
        caption = blip_processor.decode(out[0], skip_special_tokens=True)
        
        return caption
    except Exception as e:
        print(f"Error analyzing image: {str(e)}")
        return None

def generate_story(caption,theme):
    try:
        story_prompt = f"Generate a children's story with the theme '{theme}' based on the following scene: {caption}"
        inputs_story = storyt5_tokenizer(story_prompt, return_tensors="pt")
        story_output = storyt5_model.generate(**inputs_story,max_new_tokens=60)
        story = storyt5_tokenizer.decode(story_output[0], skip_special_tokens=True)
        
        return story
    except Exception as e:
        print(f"Error generating story: {str(e)}")
        return None

@app.route('/api/generate-story', methods=['POST'])
def generate_story_endpoint():
    try:
        data = request.json
        child_name = data.get('childName')
        theme = data.get('theme')
        theme_prompt = data.get('themePrompt')
        images = data.get('images', [])
        
        if not child_name or not theme or not theme_prompt:
            return jsonify({'error': 'Missing required fields'}), 400
        
        image_contexts = []
        for image_data in images:
            caption = analyze_image(image_data)
            if caption:
                image_contexts.append(caption)
        
        if not image_contexts:
            return jsonify({'error': 'No valid image captions generated'}), 400
        
        full_caption = " ".join(image_contexts)
        story = generate_story(full_caption,theme)
        
        if not story:
            return jsonify({'error': 'Failed to generate story'}), 500
        
        return jsonify({'story': story})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': time.time()
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
