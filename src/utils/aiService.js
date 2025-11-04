import axios from 'axios';

const AI_PROVIDERS = {
  NVIDIA: 'nvidia'
};

class AIService {
  constructor() {
    this.provider = AI_PROVIDERS.NVIDIA;
    this.apiKey = process.env.REACT_APP_NVIDIA_API_KEY;
    this.baseURL = 'https://integrate.api.nvidia.com/v1';
  }

  async generateData(requirements) {
    const { dataType, count, fields, description } = requirements;
    
    try {
      return await this.generateWithNVIDIA(requirements);
    } catch (error) {
      console.error('AI generation failed:', error);
      throw new Error('Failed to generate data. Please try again.');
    }
  }

  async generateWithNVIDIA(requirements) {
    const prompt = this.buildPrompt(requirements);
    
    const response = await axios.post(`${this.baseURL}/chat/completions`, {
      model: 'meta/llama-3.1-8b-instruct',
      messages: [
        {
          role: 'system',
          content: 'Generate realistic, structured data in JSON format. Return only valid JSON array.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2048
    }, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return JSON.parse(response.data.choices[0].message.content);
  }

  buildPrompt(requirements) {
    return `Generate ${requirements.count} realistic ${requirements.dataType} records as JSON array.
    
    Requirements: ${requirements.description}
    Fields needed: ${requirements.fields || 'standard fields'}
    
    Each record must have an 'id' field. Return only the JSON array, no other text.`;
  }
}

export default new AIService();
