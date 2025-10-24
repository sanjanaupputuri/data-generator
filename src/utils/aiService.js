import axios from 'axios';

// Configuration for different AI providers
const AI_PROVIDERS = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  LOCAL: 'local'
};

class AIService {
  constructor() {
    this.provider = AI_PROVIDERS.LOCAL; // Default to local mock for demo
    this.apiKey = process.env.REACT_APP_AI_API_KEY;
  }

  async generateData(requirements) {
    const { dataType, count, fields, description } = requirements;
    
    try {
      switch (this.provider) {
        case AI_PROVIDERS.OPENAI:
          return await this.generateWithOpenAI(requirements);
        case AI_PROVIDERS.ANTHROPIC:
          return await this.generateWithAnthropic(requirements);
        default:
          return await this.generateWithMock(requirements);
      }
    } catch (error) {
      console.error('AI generation failed:', error);
      throw new Error('Failed to generate data. Please try again.');
    }
  }

  async generateWithOpenAI(requirements) {
    const prompt = this.buildPrompt(requirements);
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a data generation assistant. Generate realistic, structured data based on user requirements. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return JSON.parse(response.data.choices[0].message.content);
  }

  async generateWithMock(requirements) {
    // Enhanced mock generation based on requirements
    const { dataType, count, fields, description } = requirements;
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generators = {
      'startups': this.generateStartupData,
      'customers': this.generateCustomerData,
      'products': this.generateProductData,
      'employees': this.generateEmployeeData,
      'sales': this.generateSalesData,
      'custom': this.generateCustomData
    };

    const generator = generators[dataType] || generators['custom'];
    return generator.call(this, count, fields, description);
  }

  generateStartupData(count, fields, description) {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        id: `startup_${Date.now()}_${i}`,
        name: this.generateCompanyName(),
        industry: this.getRandomItem(['FinTech', 'HealthTech', 'EdTech', 'AI/ML', 'E-commerce']),
        stage: this.getRandomItem(['Pre-seed', 'Seed', 'Series A', 'Series B']),
        location: this.getRandomItem(['San Francisco', 'New York', 'Austin', 'Boston']),
        employees: this.getRandomNumber(2, 500),
        funding: this.getRandomNumber(100000, 50000000),
        description: this.generateDescription(description),
        founded: this.getRandomDate(2015, 2024),
        website: `www.${this.generateCompanyName().toLowerCase().replace(/\s+/g, '')}.com`
      });
    }
    return data;
  }

  generateCustomerData(count, fields, description) {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        id: `customer_${Date.now()}_${i}`,
        name: this.generatePersonName(),
        email: this.generateEmail(),
        age: this.getRandomNumber(18, 80),
        location: this.getRandomItem(['New York', 'California', 'Texas', 'Florida']),
        segment: this.getRandomItem(['Premium', 'Standard', 'Basic']),
        joinDate: this.getRandomDate(2020, 2024),
        totalSpent: this.getRandomNumber(50, 5000)
      });
    }
    return data;
  }

  generateCustomData(count, fields, description) {
    const data = [];
    const fieldNames = fields ? fields.split(',').map(f => f.trim()) : ['field1', 'field2', 'field3'];
    
    for (let i = 0; i < count; i++) {
      const record = { id: `custom_${Date.now()}_${i}` };
      
      fieldNames.forEach(field => {
        record[field] = this.generateFieldValue(field, description);
      });
      
      data.push(record);
    }
    return data;
  }

  generateFieldValue(fieldName, context) {
    const lowerField = fieldName.toLowerCase();
    
    if (lowerField.includes('name')) return this.generatePersonName();
    if (lowerField.includes('email')) return this.generateEmail();
    if (lowerField.includes('phone')) return this.generatePhone();
    if (lowerField.includes('address')) return this.generateAddress();
    if (lowerField.includes('date')) return this.getRandomDate(2020, 2024);
    if (lowerField.includes('price') || lowerField.includes('amount')) return this.getRandomNumber(10, 1000);
    if (lowerField.includes('description')) return this.generateDescription(context);
    
    return this.getRandomItem(['Value A', 'Value B', 'Value C', 'Value D']);
  }

  buildPrompt(requirements) {
    return `Generate ${requirements.count} records of ${requirements.dataType} data.
    
    Requirements: ${requirements.description}
    Fields needed: ${requirements.fields || 'standard fields'}
    
    Return as a JSON array with realistic, diverse data. Each record should have an 'id' field.`;
  }

  // Helper methods
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  generateCompanyName() {
    const prefixes = ['Tech', 'Smart', 'Digital', 'Cloud', 'Data', 'AI', 'Quantum', 'Cyber'];
    const suffixes = ['Hub', 'Labs', 'Solutions', 'Works', 'Pro', 'Flow', 'Systems', 'Dynamics'];
    return `${this.getRandomItem(prefixes)}${this.getRandomItem(suffixes)}`;
  }

  generatePersonName() {
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Chris', 'Emma'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    return `${this.getRandomItem(firstNames)} ${this.getRandomItem(lastNames)}`;
  }

  generateEmail() {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'];
    const name = this.generatePersonName().toLowerCase().replace(' ', '.');
    return `${name}@${this.getRandomItem(domains)}`;
  }

  generatePhone() {
    return `+1-${this.getRandomNumber(100, 999)}-${this.getRandomNumber(100, 999)}-${this.getRandomNumber(1000, 9999)}`;
  }

  generateAddress() {
    const streets = ['Main St', 'Oak Ave', 'Park Rd', 'First St', 'Second Ave'];
    return `${this.getRandomNumber(100, 9999)} ${this.getRandomItem(streets)}`;
  }

  generateDescription(context) {
    const templates = [
      `Innovative solution for ${context || 'modern businesses'}`,
      `Advanced platform focusing on ${context || 'user experience'}`,
      `Next-generation technology for ${context || 'digital transformation'}`
    ];
    return this.getRandomItem(templates);
  }

  getRandomDate(startYear, endYear) {
    const start = new Date(startYear, 0, 1);
    const end = new Date(endYear, 11, 31);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
  }
}

export default new AIService();
