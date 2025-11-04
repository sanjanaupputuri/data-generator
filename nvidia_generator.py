import os
import requests
import json
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class NVIDIADataGenerator:
    def __init__(self):
        self.api_key = os.getenv('NVIDIA_API_KEY')
        self.base_url = 'https://integrate.api.nvidia.com/v1'
        
    def generate_custom_data(self, prompt, num_records):
        """Generate custom data based on user prompt and specifications"""
        
        payload = {
            "model": "meta/llama-3.1-8b-instruct",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 4096
        }
        
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        response = requests.post(
            f'{self.base_url}/chat/completions',
            headers=headers,
            json=payload
        )
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            
            # Clean up the response to extract JSON
            content = content.strip()
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            content = content.strip()
            
            try:
                # Try direct JSON parsing first
                return json.loads(content)
            except json.JSONDecodeError:
                try:
                    # Try to extract JSON array from response
                    import re
                    # Look for JSON array pattern
                    json_match = re.search(r'\[.*?\]', content, re.DOTALL)
                    if json_match:
                        return json.loads(json_match.group())
                    
                    # Look for JSON object pattern and wrap in array
                    obj_match = re.search(r'\{.*?\}', content, re.DOTALL)
                    if obj_match:
                        obj = json.loads(obj_match.group())
                        return [obj] if isinstance(obj, dict) else obj
                    
                    # If no JSON found, create fallback data
                    return [{"error": "Could not parse AI response", "content": content[:100]}]
                    
                except Exception:
                    # Final fallback
                    return [{"error": "Failed to parse response", "raw_content": content[:200]}]
        else:
            raise Exception(f"NVIDIA API error: {response.status_code} - {response.text}")
        
    def generate_synthetic_data(self, data_type, count=10, schema=None):
        """Generate synthetic data using NVIDIA's cloud models"""
        
        prompt = self._build_prompt(data_type, count, schema)
        
        payload = {
            "model": "meta/llama-3.1-8b-instruct",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 2048
        }
        
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        response = requests.post(
            f'{self.base_url}/chat/completions',
            headers=headers,
            json=payload
        )
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            return json.loads(content)
        else:
            raise Exception(f"NVIDIA API error: {response.status_code} - {response.text}")
    
    def _build_prompt(self, data_type, count, schema):
        base_prompt = f"Generate {count} realistic {data_type} records as JSON array."
        
        if schema:
            base_prompt += f" Use this schema: {schema}"
        
        return base_prompt

if __name__ == "__main__":
    generator = NVIDIADataGenerator()
    data = generator.generate_synthetic_data("startup companies", 5)
    print(json.dumps(data, indent=2))
