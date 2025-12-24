# Tasks CRUD API

REST API for task management built with **Node.js** and **TypeScript**, using only the native HTTP module (no Express or other frameworks).

## Architecture

The project follows **DDD (Domain-Driven Design)** and **Clean Code** principles, organized in layers:

```
src/
├── domain/           # Entities, Value Objects, Repository Interfaces
├── application/      # Use Cases, DTOs
├── infrastructure/   # Repository Implementations, Database, Services
├── presentation/     # HTTP Server, Router, Controllers, Validators
├── shared/           # Errors, Shared Utilities
└── main.ts           # Entry point with dependency injection
```

## Requirements

- Node.js >= 22.0.0 (LTS)
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start server
npm start
```

## Docker

```bash
# Start with script
./scripts/docker-start.sh

# Or with docker-compose
docker-compose up -d

# Stop
./scripts/docker-stop.sh
```

## Environment Variables

| Variable       | Description                                | Default  |
| -------------- | ------------------------------------------ | -------- |
| `PORT`         | HTTP server port                           | `3000`   |
| `STORAGE_TYPE` | Persistence type (`memory` or `sqlite`)    | `sqlite` |

## API Endpoints

### List Tasks

```http
GET /tasks
GET /tasks?title=typescript
GET /tasks?description=api
GET /tasks?title=learn&description=patterns
```

### Get Task by ID

```http
GET /tasks/:id
```

### Create Task

```http
POST /tasks
Content-Type: application/json

{
  "title": "My task",
  "description": "Task description"
}
```

### Update Task

```http
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description"
}
```

### Delete Task

```http
DELETE /tasks/:id
```

### Mark as Complete

```http
PATCH /tasks/:id/complete
```

### Import Tasks from CSV

```http
POST /tasks/import
Content-Type: multipart/form-data

file: tasks.csv
```

## CSV File Format

The CSV file must contain the columns `title`, `description`, and `completed`:

```csv
title,description,completed
Learn TypeScript,Study advanced TypeScript patterns,false
Build REST API,Create a CRUD API without frameworks,true
```

## cURL Examples

```bash
# Create task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New task", "description": "Description"}'

# List all
curl http://localhost:3000/tasks

# Filter by title
curl "http://localhost:3000/tasks?title=typescript"

# Get by ID
curl http://localhost:3000/tasks/UUID-HERE

# Update
curl -X PUT http://localhost:3000/tasks/UUID-HERE \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated", "description": "New description"}'

# Mark as complete
curl -X PATCH http://localhost:3000/tasks/UUID-HERE/complete

# Delete
curl -X DELETE http://localhost:3000/tasks/UUID-HERE

# Import CSV
curl -X POST http://localhost:3000/tasks/import \
  -F "file=@sample-tasks.csv"
```

## Response Structure

### Success

```json
{
  "error": false,
  "message": "Success",
  "data": { ... }
}
```

### Error

```json
{
  "error": true,
  "message": "Error description",
  "statusCode": 400
}
```

## Technologies

- **Node.js** (native HTTP)
- **TypeScript** 5.7+
- **better-sqlite3** - SQLite database
- **csv-parse** - CSV parser
- **busboy** - multipart/form-data parser

## License

MIT
