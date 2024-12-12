# Annotations server

## Usage

To start the server, run

```
npx tsx src/index.ts
```

To test the endpoints, use CURL or postman, CURL examples:

### GET (annotations)

```bash
curl -X GET http://localhost:3000/annotations/all
```

```bash
curl -X GET http://localhost:3000/annotations/<model_id>
```

### POST (create - annotation)

```bash
curl -X POST http://localhost:3000/annotations -H "Content-Type: application/json" -d '{"x": 1, "y": 2, "z": 3, "content": "Sample annotation", "operatorId": 1, "modelId": 1}'
```

### PUT (update - annotation)

```bash
curl -X PUT http://localhost:3000/annotations/<id> -H "Content-Type: application/json" -d '{"content": "Updated annotation"}'
```

### POST/PUT (annotation, using pipe)

To avoid inlining JSON, you can create a JSON file for an annotation, e.g.:

create a file: annotation-1.json
```json
{
    "x": 1, 
    "y": 2, 
    "z": 3, 
    "content": "Sample annotation", 
    "operatorId": 1, 
    "modelId": 1
}
```

and use the file as an input, like so:

```bash
cat annotation-1.json | curl -X POST http://localhost:3000/annotations -H "Content-Type: application/json" -d @-
```

## API Spec

### Operators

- **POST /operators**
  - Description: Create a new operator.
  - Request Body: `{ "name": "string", "surname": "string" }`
  - Response: `{ "id": "number" }`

- **GET /operators/:id**
  - Description: Get an operator by ID.
  - Response: `{ "id": "number", "name": "string", "surname": "string" }`

- **GET /operators**
  - Description: Get all operators.
  - Response: `[ { "id": "number", "name": "string", "surname": "string" }, ... ]`

- **PUT /operators/:id**
  - Description: Update an operator by ID.
  - Request Body: `{ "name": "string", "surname": "string" }`
  - Response: `"Operator updated"`

- **DELETE /operators/:id**
  - Description: Delete an operator by ID.
  - Response: `"Operator deleted"`

### Annotations

- **POST /annotations**
  - Description: Create a new annotation.
  - Request Body: `{ "x": "number", "y": "number", "z": "number", "content": "string", "operatorId": "number", "modelId": "number" }`
  - Response: `{ "id": "number" }`

- **GET /annotations/all**
  - Description: Get all annotations.
  - Response: `[ { "id": "number", "x": "number", "y": "number", "z": "number", "content": "string", "operatorId": "number", "modelId": "number" }, ... ]`

- **GET /annotations/:model_id**
  - Description: Get annotations by model ID.
  - Response: `[ { "id": "number", "x": "number", "y": "number", "z": "number", "content": "string", "operatorId": "number", "modelId": "number" }, ... ]`

- **PUT /annotations/:id**
  - Description: Update an annotation by ID.
  - Request Body: `{ "x": "number", "y": "number", "z": "number", "content": "string", "operatorId": "number", "modelId": "number" }`
  - Response: `"Annotation updated"`

- **DELETE /annotations/:id**
  - Description: Delete an annotation by ID.
  - Response: `"Annotation deleted"`

### Database

- **POST /db/clear**
  - Description: Clear and reinitialize the database.
  - Response: `"Database cleared and reinitialized"`
