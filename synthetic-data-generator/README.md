# Synthetic Data Generator

A full-stack web application for generating synthetic test data for startups and small companies.

## Features

- 🎯 Natural language prompts for data structure definition
- 📊 Interactive data table with inline editing
- 💾 Export data as CSV or JSON
- 🔐 User authentication and session management
- 💽 Persistent data storage with SQLite
- 🚀 Production-ready with proper error handling

## Tech Stack

- **Frontend**: React 18 + TypeScript + Material-UI
- **Backend**: Node.js + Express + SQLite
- **Authentication**: JWT tokens
- **Data Generation**: Faker.js

## Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd synthetic-data-generator
```

2. Install all dependencies:
```bash
npm run install-all
```

3. Start the development servers:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
synthetic-data-generator/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth & validation
│   │   └── database/       # Database config
│   └── package.json
├── frontend/               # React TypeScript app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API calls
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Helper functions
│   └── package.json
└── package.json           # Root package.json
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/data/generate` - Generate synthetic data
- `GET /api/data/datasets` - Get user datasets
- `PUT /api/data/datasets/:id` - Update dataset
- `DELETE /api/data/datasets/:id` - Delete dataset

## Usage

1. Register/Login to the application
2. Enter a natural language prompt (e.g., "customer records with name, email, age, purchase history")
3. Specify the number of records to generate
4. Edit the generated data inline if needed
5. Export as CSV or JSON

## Environment Variables

Create `.env` files in backend directory:

```
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
```
