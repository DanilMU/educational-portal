# Gemini Code Assistant Context

## Project Overview

This project is an educational portal for occupational safety and other subjects. It is a monorepo containing a **Next.js frontend** and a **NestJS backend**.

- **`frontend/`**: The Next.js application that serves as the user interface.
- **`backend/`**: The NestJS application that provides the REST API and business logic.

The project uses `yarn` as the package manager.

---

## Backend (`backend/`)

The backend is a [NestJS](https://nestjs.com/) application responsible for handling business logic, data storage, and providing a RESTful API for the frontend.

### Key Technologies

- **Framework**: NestJS
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Database**: PostgreSQL (managed via Docker)
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger

### Getting Started

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    yarn install
    ```

3.  **Start the database:**
    Make sure you have Docker installed and running.
    ```bash
    docker-compose up -d
    ```

4.  **Run database migrations:**
    ```bash
    yarn prisma migrate dev
    ```

5.  **Run the application in development mode:**
    This will start the server with hot-reloading at `http://localhost:3000`.
    ```bash
    yarn run start:dev
    ```

### Other Useful Commands

- **Build the application:**
  ```bash
  yarn run build
  ```
- **Run in production mode:**
  ```bash
  yarn run start:prod
  ```
- **Run tests:**
  ```bash
  # Unit tests
  yarn run test

  # End-to-end tests
  yarn run test:e2e
  ```
- **Prisma commands:**
  Use `yarn prisma` to run any Prisma command.
  ```bash
  # Open Prisma Studio
  yarn prisma studio

  # Generate Prisma Client
  yarn prisma generate
  ```

### Development Conventions

The file `project(backend).md` contains a detailed analysis and implementation plan for the backend. It outlines the required modules (`subjects`, `topics`, `lessons`, `quizzes`, etc.), the database schema, and the steps for future development. This file should be consulted before adding new features.

---

## Frontend (`frontend/`)

The frontend is a [Next.js](https://nextjs.org/) application that provides the user interface for the educational portal.

### Key Technologies

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: `lucide-react` for icons.

### Getting Started

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    yarn install
    ```

3.  **Run the development server:**
    This will start the server at `http://localhost:3000`.
    ```bash
    yarn dev
    ```

### Other Useful Commands

- **Build for production:**
  ```bash
  yarn build
  ```
- **Start the production server:**
  ```bash
  yarn start
  ```
- **Lint files:**
  ```bash
  yarn lint
  ```
