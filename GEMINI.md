## Project Overview

This is the backend for an educational portal, built with the NestJS framework. It uses TypeScript and follows a modular architecture. Key features include user authentication (JWT), course and lesson management, quizzes, and progress tracking. The database is PostgreSQL, managed with the Prisma ORM.

## Building and Running

The project is managed with `yarn`. The main commands are located in the `backend/` directory.

**Installation:**
```bash
cd backend
yarn install
```

**Running the app:**

*   **Development mode:** `yarn start:dev` (with file watching)
*   **Production mode:** `yarn start:prod` (after building)

**Building the app:**
```bash
yarn build
```

**Testing:**

*   **Unit tests:** `yarn test`
*   **End-to-end tests:** `yarn test:e2e`

**Database:**

The project uses Prisma for database migrations and management.
*   **Run migrations:** `yarn prisma migrate dev`
*   **Generate Prisma client:** `yarn prisma generate`

## Development Conventions

*   **Code Style:** The project uses Prettier for code formatting and ESLint for linting.
    *   **Format code:** `yarn format`
    *   **Lint code:** `yarn lint`
*   **Framework:** The backend is built with NestJS. Follow the official NestJS conventions and documentation.
*   **API Documentation:** Swagger is used for API documentation, available at `/api` when the application is running.
*   **Commits:** Commits should follow the Conventional Commits specification.
