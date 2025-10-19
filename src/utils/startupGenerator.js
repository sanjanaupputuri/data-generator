const industries = ["FinTech", "HealthTech", "EdTech", "E-commerce", "SaaS", "AI/ML", "IoT", "Blockchain", "GreenTech", "FoodTech"];
const stages = ["Pre-seed", "Seed", "Series A", "Series B", "Series C"];
const locations = ["San Francisco", "New York", "Austin", "Boston", "Seattle", "Los Angeles", "Chicago", "Miami", "Denver", "Atlanta"];
const businessModels = ["B2B", "B2C", "B2B2C", "Marketplace", "Subscription", "Freemium"];

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateStartup = () => {
  const foundedDate = new Date(Date.now() - getRandomNumber(30, 2000) * 24 * 60 * 60 * 1000);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${getRandomItem(['Tech', 'Smart', 'Digital', 'Cloud', 'Data', 'AI'])}${getRandomItem(['Hub', 'Labs', 'Solutions', 'Works', 'Pro', 'Flow'])}`,
    industry: getRandomItem(industries),
    stage: getRandomItem(stages),
    location: getRandomItem(locations),
    foundedDate: foundedDate.toISOString().split('T')[0],
    employees: getRandomNumber(2, 500),
    fundingRaised: getRandomNumber(50000, 50000000),
    businessModel: getRandomItem(businessModels),
    revenue: Math.random() > 0.3 ? getRandomNumber(0, 10000000) : 0,
    isProfitable: Math.random() > 0.5,
    website: `www.${getRandomItem(['tech', 'smart', 'digital'])}${getRandomNumber(100, 999)}.com`
  };
};

export const generateBatch = (count) => {
  return Array.from({ length: count }, generateStartup);
};
