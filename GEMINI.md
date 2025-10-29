# Gemini Project Context: educational-portal

## Project Overview

This project is an educational portal built with a monorepo architecture. It consists of a backend application and presumably a frontend (though the frontend is not present in the current directory structure).

### Backend

The backend is a [NestJS](https://nestjs.com/) application written in TypeScript. It serves as the API for the educational portal.

**Key Technologies:**

*   **Framework:** NestJS
*   **Language:** TypeScript
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Authentication:** JWT (JSON Web Tokens)
*   **Environment:** Docker is used for the development database.

**Project Structure:**

The backend code is located in the `backend/` directory. It follows a modular structure, with features such as authentication, users, subjects, and lessons organized into their own modules.

*   `src/api/`: Contains the different API modules.
*   `src/infra/`: Infrastructure modules like Prisma.
*   `prisma/`: Contains the Prisma schema (`schema.prisma`), which defines the database models.
*   `docker-compose.yml`: Defines the PostgreSQL service for the development environment.

## Building and Running

### Backend

**1. Install Dependencies:**

Use `yarn` to install the project dependencies.

```bash
yarn install
```

**2. Start the Database:**

The project uses a PostgreSQL database, which can be started using Docker Compose.

```bash
docker-compose up -d
```

**3. Run the Application:**

You can run the backend application in several modes:

*   **Development mode (with watch):**
    ```bash
    yarn run start:dev
    ```
*   **Production mode:**
    ```bash
    yarn run start:prod
    ```

The application will be available at the host and port specified in your environment variables (`HTTP_HOST` and `HTTP_PORT`).

**4. Running Tests:**

The project has both unit and end-to-end tests.

*   **Run unit tests:**
    ```bash
    yarn run test
    ```
*   **Run end-to-end tests:**
    ```bash
    yarn run test:e2e
    ```

## Development Conventions

*   **Package Manager:** The project uses `yarn` for package management.
*   **Code Style:** Code is formatted with [Prettier](https://prettier.io/) and linted with [ESLint](https://eslint.org/). Use the following command to format the code:
    ```bash
    yarn run format
    ```
*   **Database Schema:** The database schema is managed with Prisma. To make changes to the database schema, edit the `prisma/schema.prisma` file and then run Prisma's migration commands.
*   **Modularity:** The backend is organized into modules. When adding new features, follow the existing modular structure.
*   **Commits:** (No explicit commit message convention found, but it is recommended to follow conventional commit standards).
