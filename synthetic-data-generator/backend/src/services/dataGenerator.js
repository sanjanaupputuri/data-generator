const faker = require('faker');

/**
 * Generate synthetic data based on natural language prompt
 * @param {string} prompt - Natural language description of desired data
 * @param {number} count - Number of records to generate
 * @returns {Array} Generated synthetic data
 */
const generateSyntheticData = (prompt, count = 10) => {
  const fields = parsePrompt(prompt);
  const data = [];

  for (let i = 0; i < count; i++) {
    const record = { id: i + 1 };
    
    fields.forEach(field => {
      record[field.name] = generateFieldValue(field.type, field.name);
    });
    
    data.push(record);
  }

  return data;
};

/**
 * Parse natural language prompt to extract field types
 * @param {string} prompt - User's natural language prompt
 * @returns {Array} Array of field objects with name and type
 */
const parsePrompt = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  const fields = [];

  // Common field patterns
  const fieldPatterns = [
    { keywords: ['name', 'full name', 'customer name'], type: 'name', name: 'name' },
    { keywords: ['first name', 'firstname'], type: 'firstName', name: 'firstName' },
    { keywords: ['last name', 'lastname', 'surname'], type: 'lastName', name: 'lastName' },
    { keywords: ['email', 'email address'], type: 'email', name: 'email' },
    { keywords: ['phone', 'phone number', 'mobile'], type: 'phone', name: 'phone' },
    { keywords: ['age'], type: 'age', name: 'age' },
    { keywords: ['address', 'street address'], type: 'address', name: 'address' },
    { keywords: ['city'], type: 'city', name: 'city' },
    { keywords: ['country'], type: 'country', name: 'country' },
    { keywords: ['company', 'organization'], type: 'company', name: 'company' },
    { keywords: ['job', 'job title', 'position'], type: 'jobTitle', name: 'jobTitle' },
    { keywords: ['salary', 'income'], type: 'salary', name: 'salary' },
    { keywords: ['date', 'created date', 'birth date'], type: 'date', name: 'date' },
    { keywords: ['price', 'cost', 'amount'], type: 'price', name: 'price' },
    { keywords: ['description'], type: 'description', name: 'description' },
    { keywords: ['status'], type: 'status', name: 'status' },
    { keywords: ['category'], type: 'category', name: 'category' },
    { keywords: ['purchase history', 'orders'], type: 'purchaseHistory', name: 'purchaseHistory' }
  ];

  // Find matching fields in prompt
  fieldPatterns.forEach(pattern => {
    pattern.keywords.forEach(keyword => {
      if (lowerPrompt.includes(keyword)) {
        if (!fields.find(f => f.name === pattern.name)) {
          fields.push({ name: pattern.name, type: pattern.type });
        }
      }
    });
  });

  // Default fields if none found
  if (fields.length === 0) {
    fields.push(
      { name: 'name', type: 'name' },
      { name: 'email', type: 'email' },
      { name: 'age', type: 'age' }
    );
  }

  return fields;
};

/**
 * Generate value for specific field type
 * @param {string} type - Field type
 * @param {string} fieldName - Field name for context
 * @returns {any} Generated value
 */
const generateFieldValue = (type, fieldName) => {
  switch (type) {
    case 'name':
      return faker.name.findName();
    case 'firstName':
      return faker.name.firstName();
    case 'lastName':
      return faker.name.lastName();
    case 'email':
      return faker.internet.email();
    case 'phone':
      return faker.phone.phoneNumber();
    case 'age':
      return faker.datatype.number({ min: 18, max: 80 });
    case 'address':
      return faker.address.streetAddress();
    case 'city':
      return faker.address.city();
    case 'country':
      return faker.address.country();
    case 'company':
      return faker.company.companyName();
    case 'jobTitle':
      return faker.name.jobTitle();
    case 'salary':
      return faker.datatype.number({ min: 30000, max: 150000 });
    case 'date':
      return faker.date.past().toISOString().split('T')[0];
    case 'price':
      return parseFloat(faker.commerce.price());
    case 'description':
      return faker.lorem.sentence();
    case 'status':
      return faker.random.arrayElement(['active', 'inactive', 'pending', 'completed']);
    case 'category':
      return faker.commerce.department();
    case 'purchaseHistory':
      return faker.datatype.number({ min: 0, max: 50 });
    default:
      return faker.lorem.word();
  }
};

module.exports = { generateSyntheticData };
