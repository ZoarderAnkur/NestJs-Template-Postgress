# NextJs-Template-Postgress

This project is a template for building a full-stack application using **Next.js** as the frontend framework and **NestJS** as the backend framework. The backend uses **PostgreSQL** as the database and integrates with **TypeORM** for database interactions. The project also includes authentication and role-based access control (RBAC) using **JWT**.

---

## Features

-   **Next.js** for the frontend.
-   **NestJS** for the backend.
-   **PostgreSQL** database with **TypeORM**.
-   Authentication using **JWT**.
-   Role-based access control (RBAC).
-   File upload functionality.
-   Microservice communication using **TCP transport**.
-   Modular architecture for scalability.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   **Node.js** (v16 or higher)
-   **npm** or **yarn**
-   **PostgreSQL** (v12 or higher)
-   **Docker** (optional, for running services in containers)

---

## Installation

1.  Clone the repository:

    ```bash
    git clone [https://github.com/your-repo/NextJs-Template-Postgress.git](https://github.com/your-repo/NextJs-Template-Postgress.git)
    cd NextJs-Template-Postgress
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up the environment variables:

    Create a `.env` file in the root directory and add the following variables:

    ```plaintext
    # Database Configuration
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name

    # JWT Configuration
    JWT_SECRET=your_jwt_secret

    # Microservice Configuration
    PYTHON_MICROSERVICE_HOST=localhost
    PYTHON_MICROSERVICE_PORT=3001
    ```

---

## Development Mode

To start the project in development mode:

1.  **Start the Application**

    Start the backend:

    ```bash
    npm run start:dev
    ```

2.  **Sign Up as a User**

    Use the `/users/signUp` endpoint to create a new user. This user will initially have the default role (`UNKNOWN`).

    **Endpoint:**

    `POST /users/signUp`

    **Request Body:**

    ```json
    {
      "EMAIL": "admin@example.com",
      "PASSWORD": "Admin@123",
      "NAME": "Admin User",
      "PHONE_NUMBER": "1234567890",
      "LOCATION": "Headquarters"
    }
    ```

    **Response:**

    ```json
    {
      "statusCode": 201,
      "message": "You have registered successfully"
    }
    ```

3.  **Open your PostgreSQL database.**

    Run the following SQL query to update the user's role:

    ```sql
    UPDATE "JK_USERS"
    SET "ROLE" = 'Admin', "VERIFIED" = true, "EULA" = true
    WHERE "EMAIL" = 'admin@example.com';
    ```

4.  **Login as the User**

    Use the `/users/login` endpoint to log in with the newly created user credentials. This will provide a JWT token.

    **Endpoint:**

    `POST /users/login`

    **Request Body:**

    ```json
    {
      "EMAIL": "admin@example.com",
      "PASSWORD": "Admin@123"
    }
    ```

    **Response:**

    ```json
    {
      "statusCode": 200,
      "message": "You have logged in successfully",
      "accessToken": "your_jwt_token",
      "userInfo": {
        "EMAIL": "admin@example.com",
        "NAME": "Admin User",
        "ROLE": "Admin",
        "...": "..."
      }
    }
    ```

5.  **Use the accessToken in the header as "x-access-token" to access all APIs.**

---

## Project Structure

├── src
│   ├── ingestion
│   │   ├── ingestion.controller.ts
│   │   ├── ingestion.module.ts
│   │   ├── ingestion.service.ts
│   │   └── dto
│   ├── documents
│   │   ├── documents.controller.ts
│   │   ├── documents.module.ts
│   │   ├── documents.service.ts
│   │   └── dto
│   ├── users
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   └── dto
│   └── shared
│       ├── entities
│       ├── guards
│       ├── decorators
│       └── enums
├── uploads
├── .env
├── package.json
└── README.md