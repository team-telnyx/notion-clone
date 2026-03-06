# Notion Clone - Backend

Express + TypeScript + Knex.js backend for Notion Clone.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled production server
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
backend/
├── src/
│   ├── db/           # Database connection
│   ├── middleware/   # Express middleware
│   ├── routes/       # API routes
│   └── types/        # TypeScript type definitions
├── migrations/       # Knex database migrations
├── knexfile.ts       # Knex configuration
└── tsconfig.json     # TypeScript configuration
```

## API Endpoints

- `GET /health` - Health check endpoint

## Environment Variables

See `.env.example` for required environment variables.
