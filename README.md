# API Monitor

A NestJS-based API monitoring and logging system that helps track and analyze API usage, performance, and behavior.

## Features

- API endpoint monitoring and logging
- User authentication and authorization
- API usage tracking
- Performance metrics collection

## Tech Stack

- NestJS
- TypeScript
- MongoDB (with Mongoose)
- JWT Authentication

## Project Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd api-monitor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Running the Application

```bash
# Development mode
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── api-logs/          # API logging module
├── apis/             # API management module
├── user/             # User management module
├── guards/           # Authentication guards
└── main.ts           # Application entry point
```

## License

This project is [MIT licensed](LICENSE).