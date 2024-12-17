# 🎬 **NestJS Movies & Genres API**  
A robust and scalable REST API for managing **Movies** and **Genres**. Built with **NestJS**, this project implements CRUD operations, validation, and Swagger documentation. Ideal for building movie management systems, learning backend concepts, or integrating with frontend clients.

---

## **🚀 Features**

- ✅ **Movies Management**: CRUD operations for movies (Create, Read, Update, Delete).  
- ✅ **Genres Management**: CRUD operations for genres with relationships to movies.  
- ✅ **Pagination**: Paginated results for movie lists.  
- ✅ **Validation**: Ensures request payloads are validated using **class-validator**.  
- ✅ **Error Handling**: Custom exceptions for better error messages.  
- ✅ **Swagger Documentation**: Interactive API docs via Swagger UI.  
- ✅ **Middleware Logging**: Custom middleware for request logging.  
- ✅ **Unit & E2E Tests**: Comprehensive testing using Jest.  

---

## **🛠️ Tech Stack**

- **NestJS** - Backend framework  
- **TypeScript** - Type-safe development  
- **TypeORM** - Database ORM  
- **PostgreSQL** - Default database (configurable)  
- **Swagger** - API documentation  
- **Jest** - Testing framework  

---

## **📁 Project Structure**

```bash
src/
│
├── app/                # Main application module
├── movies/             # Movies module
│   ├── dto/            # Data Transfer Objects for Movies
│   ├── entities/       # Movie Entity (TypeORM)
│   ├── exceptions/     # Custom exceptions for Movies
│   ├── movies.service.ts  # Business logic for Movies
│   ├── movies.controller.ts  # Movie API endpoints
│   ├── movies.module.ts  # Movies module setup
│   └── tests/          # Unit tests for Movies module
│
├── genres/             # Genres module
│   ├── dto/            # Data Transfer Objects for Genres
│   ├── entities/       # Genre Entity (TypeORM)
│   ├── exceptions/     # Custom exceptions for Genres
│   ├── genres.service.ts  # Business logic for Genres
│   ├── genres.controller.ts  # Genre API endpoints
│   ├── genres.module.ts  # Genres module setup
│   └── tests/          # Unit tests for Genres module
│
├── middleware/         # Custom middleware (LoggerMiddleware)
├── main.ts             # Entry point to bootstrap the app
└── swagger.json        # Swagger configuration
```

---

## **📦 Installation**
Follow the steps below to set up the project locally.

### **1. Clone the Repository**

Clone this repository to your local machine using Git:

```bash 
git clone https://github.com/your-username/nestjs-movie-api.git
cd nestjs-movie-api
```

### **2. Install Dependencies**

Ensure you have **Node.js** (v14+) and **npm** or **Yarn** installed.

Run the following command to install project dependencies:

```bash
npm install
```

### **3. Configure the Environment**

Create a `.env` file in the project root directory and add the following configurations:

```env
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=movies_db
```

### **4. Set Up the Database**
Ensure you have a PostgreSQL database running.

Update your database details in the .env file.
Run the TypeORM migrations (if applicable) to create the required tables:
```bash
npm run typeorm migration:run
```

### **5. Run the Application**
Start the server using one of the following modes:
Development (with hot reload):
```bash
npm run start:dev
```
Production:
```bash
npm run start:prod
```
### **6. Access the API**
Once the server is running, you can access the API at:

Base URL: http://localhost:3000
Swagger Documentation: http://localhost:3000/api
The Swagger UI provides an interactive interface to test all the endpoints.

## **🧪 Run Tests**

To ensure the application works as expected, you can run the following tests:

Unit Tests:
```bash
npm run test
```
End-to-End (e2e) Tests:
```bash
npm run test:e2e
```
Test Coverage:
```bash
npm run test:cov
```

## **✨ Implemented Functionalities**

### **1. Movies Management**
Add a new movie.
Retrieve a list of movies with optional pagination.
Search movies by title and genre.
Retrieve movie details by ID.
Update movie details.
Delete a movie by ID.

### **2. Genres Management**
Add a new genre.
Retrieve a list of all genres.
Retrieve genre details by ID.
Update genre details.
Delete a genre by ID and remove its references in movies.

### **3. Validation**
Input validation for all request payloads using class-validator.

### **4. Error Handling**
Custom exceptions for movies and genres when entities are not found.

### **5. Middleware Logging**
Logs all incoming requests and response times.

### **6. Swagger API Documentation**
Provides an interactive API interface for testing endpoints.

### **7. Testing**
Unit tests for all services and controllers.

## **🛠️ API Endpoints**

### **Movies Endpoints**

| Method   | Endpoint              | Description                     |
|----------|-----------------------|---------------------------------|
| `GET`    | `/ListMovies`         | Retrieve a paginated list of movies. |
| `GET`    | `/ListOneMovie/:id`   | Retrieve details of a specific movie by its ID. |
| `GET`    | `/SearchMovies`       | Search for movies by title or genre. |
| `POST`   | `/AddMovie`           | Add a new movie to the database. |
| `PATCH`  | `/UpdateMovie/:id`    | Update an existing movie by its ID. |
| `DELETE` | `/DeleteMovie/:id`    | Delete a specific movie by its ID. |

---

### **Genres Endpoints**

| Method   | Endpoint              | Description                     |
|----------|-----------------------|---------------------------------|
| `GET`    | `/ListGenres`         | Retrieve a list of all genres.  |
| `GET`    | `/ListOneGenre/:id`   | Retrieve details of a specific genre by its ID. |
| `POST`   | `/AddGenre`           | Add a new genre to the database. |
| `PATCH`  | `/UpdateGenre/:id`    | Update an existing genre by its ID. |
| `DELETE` | `/DeleteGenre/:id`    | Delete a specific genre by its ID. |

---

### **📌 Notes:**

- **Pagination**:  
  For the `ListMovies` endpoint, pagination parameters (`page`, `limit`) can be passed as query parameters.  

  Example:  
  ```http
  GET /ListMovies?page=1&limit=10
  ```

- **SearchMovies**

  Allows searching for movies based on **title** and **genre**. Both `title` and `genre` are optional query parameters.

  Example:
  ```http
  GET /SearchMovies?title=Inception&genre=Sci-Fi
  ```

  ### **Request Payload**

For the following endpoints, a **JSON payload** must be provided:  

- **AddMovie**  
- **AddGenre**  
- **UpdateMovie**  
- **UpdateGenre**  

---

#### **AddMovie Example**

```json
{
  "title": "Inception",
  "description": "A mind-bending thriller",
  "releaseDate": "2010-07-16",
  "genres": ["Sci-Fi", "Action"]
}
```

