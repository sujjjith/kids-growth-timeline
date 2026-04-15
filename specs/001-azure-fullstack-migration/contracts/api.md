# API Contracts: Azure Full-Stack Migration

**Feature**: 001-azure-fullstack-migration
**Base URL**: `/api`
**Auth**: All endpoints except `/api/auth/*` require `Authorization: Bearer <JWT>` header

---

## Authentication

### `GET /api/auth/google`

Initiates Google OAuth 2.0 flow. Redirects to Google consent screen.

### `GET /api/auth/google/callback`

Google OAuth callback. On success, redirects to frontend with JWT token.

- **Redirect**: `{FRONTEND_URL}/auth/callback?token={jwt}`

### `GET /api/auth/me`

Returns the authenticated user's profile.

- **Response 200**:
  ```json
  {
    "id": "uuid",
    "email": "user@gmail.com",
    "displayName": "John Doe",
    "avatarUrl": "https://..."
  }
  ```
- **Response 401**: `{ "message": "Unauthorized" }`

---

## Kid Profiles

### `GET /api/kids`

List all kid profiles for the authenticated user.

- **Response 200**:
  ```json
  [
    {
      "id": "uuid",
      "firstName": "Nirek",
      "lastName": "Kumar",
      "dateOfBirth": "2022-03-15",
      "gender": "Male",
      "nickname": "Niru",
      "notes": null,
      "createdAt": "2026-04-14T00:00:00Z"
    }
  ]
  ```

### `POST /api/kids`

Create a new kid profile.

- **Request Body**:
  ```json
  {
    "firstName": "Nirek",
    "lastName": "Kumar",
    "dateOfBirth": "2022-03-15",
    "gender": "Male",
    "nickname": "Niru",
    "notes": ""
  }
  ```
- **Validation**: firstName required (max 100); dateOfBirth required (must be past); gender required (Male/Female/Other)
- **Response 201**: Created kid object
- **Response 400**: `{ "message": ["validation errors..."] }`

### `GET /api/kids/:id`

Get a single kid profile.

- **Response 200**: Kid object
- **Response 403**: `{ "message": "Forbidden" }` (not user's kid)
- **Response 404**: `{ "message": "Not Found" }`

### `PUT /api/kids/:id`

Update a kid profile. Body: same shape as POST (partial allowed).

- **Response 200**: Updated kid object

### `DELETE /api/kids/:id`

Delete a kid profile and all associated records (cascade).

- **Response 200**: `{ "message": "Deleted" }`

---

## Education Records

### `GET /api/kids/:kidId/education`

List all education records for a kid.

- **Query params**: `?page=1&limit=20`
- **Response 200**: `{ "data": [...], "total": 5, "page": 1, "limit": 20 }`

### `POST /api/kids/:kidId/education`

Create an education record. Also auto-creates a TimelineEvent.

- **Request Body**:
  ```json
  {
    "schoolName": "Lincoln Elementary",
    "grade": "1st Grade",
    "startDate": "2028-08-15",
    "endDate": null,
    "achievement": "Honor Roll",
    "description": "Started first grade",
    "category": "School"
  }
  ```
- **Validation**: schoolName required; startDate required; endDate must be after startDate if present
- **Response 201**: Created education record

### `GET /api/kids/:kidId/education/:id`

Get a single education record.

### `PUT /api/kids/:kidId/education/:id`

Update an education record.

### `DELETE /api/kids/:kidId/education/:id`

Delete an education record and its timeline event.

---

## Activities

### `GET /api/kids/:kidId/activities`

### `POST /api/kids/:kidId/activities`

- **Request Body**:
  ```json
  {
    "activityName": "Swimming Lessons",
    "activityType": "Sports",
    "provider": "YMCA",
    "startDate": "2026-06-01",
    "endDate": "2026-08-31",
    "dayOfWeek": "Tuesday",
    "description": "Weekly swim class"
  }
  ```
- **Validation**: activityName required; activityType required; startDate required

### `GET /api/kids/:kidId/activities/:id`

### `PUT /api/kids/:kidId/activities/:id`

### `DELETE /api/kids/:kidId/activities/:id`

---

## Competitions

### `GET /api/kids/:kidId/competitions`

### `POST /api/kids/:kidId/competitions`

- **Request Body**:
  ```json
  {
    "competitionName": "Science Fair 2026",
    "competitionType": "Science Fair",
    "eventDate": "2026-04-20",
    "result": "Gold Medal",
    "placement": "1st Place",
    "description": "Solar system model"
  }
  ```
- **Validation**: competitionName required; eventDate required

### `GET /api/kids/:kidId/competitions/:id`

### `PUT /api/kids/:kidId/competitions/:id`

### `DELETE /api/kids/:kidId/competitions/:id`

---

## Summer Camps

### `GET /api/kids/:kidId/camps`

### `POST /api/kids/:kidId/camps`

- **Request Body**:
  ```json
  {
    "campName": "Camp Discovery",
    "campType": "Day Camp",
    "location": "Austin, TX",
    "startDate": "2026-06-15",
    "endDate": "2026-07-15",
    "highlights": "Archery, Nature hikes",
    "description": "Summer adventure camp"
  }
  ```
- **Validation**: campName required; startDate required

### `GET /api/kids/:kidId/camps/:id`

### `PUT /api/kids/:kidId/camps/:id`

### `DELETE /api/kids/:kidId/camps/:id`

---

## Vacation Trips

### `GET /api/trips`

List all trips for the authenticated user (both family and individual).

- **Query params**: `?kidId=uuid` (optional filter)

### `POST /api/trips`

- **Request Body**:
  ```json
  {
    "kidId": "uuid or null",
    "tripType": "Family",
    "tripName": "Grand Canyon Road Trip",
    "destination": "Grand Canyon, AZ",
    "startDate": "2026-07-01",
    "endDate": "2026-07-07",
    "highlights": "Hiking, rafting",
    "description": "Summer family trip"
  }
  ```
- **Validation**: tripName required; destination required; startDate required; tripType must be "Family" or "Individual"; if "Individual", kidId required
- **Note**: Trips are at user level (not nested under kids) because family trips span all kids

### `GET /api/trips/:id`

### `PUT /api/trips/:id`

### `DELETE /api/trips/:id`

---

## Growth Measurements

### `GET /api/kids/:kidId/growth`

List growth measurements, ordered by measurementDate ascending.

### `POST /api/kids/:kidId/growth`

- **Request Body**:
  ```json
  {
    "measurementDate": "2026-04-14",
    "heightInches": 42.5,
    "weightLbs": 38.2,
    "notes": "Annual checkup"
  }
  ```
- **Validation**: measurementDate required; at least one of heightInches or weightLbs required; values must be > 0

### `GET /api/kids/:kidId/growth/:id`

### `PUT /api/kids/:kidId/growth/:id`

### `DELETE /api/kids/:kidId/growth/:id`

---

## Timeline Events

### `GET /api/timeline`

List all timeline events for the authenticated user.

- **Query params**: `?kidId=uuid&category=education&page=1&limit=50`
- **Response 200**:
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "kidId": "uuid",
        "eventDate": "2026-04-14",
        "eventTitle": "Started 1st Grade at Lincoln Elementary",
        "eventCategory": "education",
        "description": "Started first grade",
        "relatedEntityId": "uuid",
        "createdAt": "2026-04-14T00:00:00Z"
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 50
  }
  ```
- **Note**: Timeline events are read-only from the frontend. They are auto-created/deleted by the backend when entity records are created/deleted.

---

## Photos

### `POST /api/kids/:kidId/photos`

Upload a photo. Multipart form data.

- **Form fields**: `file` (binary), `relatedEntityId` (optional UUID), `relatedEntityType` (optional string)
- **Validation**: file must be image/jpeg or image/png; max 10 MB
- **Response 201**:
  ```json
  {
    "id": "uuid",
    "kidId": "uuid",
    "url": "https://storageaccount.blob.core.windows.net/photos/...?sv=...&se=...&sig=...",
    "fileName": "photo.jpg",
    "contentType": "image/jpeg",
    "fileSizeBytes": 245000,
    "createdAt": "2026-04-14T00:00:00Z"
  }
  ```
- **Note**: `url` is a time-limited SAS URL (valid 1 hour)

### `GET /api/kids/:kidId/photos`

List photos for a kid. Returns metadata with SAS URLs.

- **Query params**: `?relatedEntityId=uuid&relatedEntityType=education`

### `DELETE /api/kids/:kidId/photos/:id`

Delete a photo from blob storage and database.

---

## Common Error Responses

| Status | Body                                                              | When                          |
| ------ | ----------------------------------------------------------------- | ----------------------------- |
| 400    | `{ "message": ["validation errors..."], "error": "Bad Request" }` | Invalid input                 |
| 401    | `{ "message": "Unauthorized" }`                                   | Missing/invalid JWT           |
| 403    | `{ "message": "Forbidden" }`                                      | Accessing another user's data |
| 404    | `{ "message": "Not Found" }`                                      | Entity does not exist         |
| 413    | `{ "message": "File too large" }`                                 | Upload exceeds 10 MB          |
| 500    | `{ "message": "Internal Server Error" }`                          | Unexpected error              |
