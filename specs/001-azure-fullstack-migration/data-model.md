# Data Model: Azure Full-Stack Migration

**Feature**: 001-azure-fullstack-migration
**Date**: 2026-04-14
**Source**: Migrated from Palantir OSDK ontology (`ontology/ontology.ts`)

## Entity Relationship Diagram

```
User (1) ──── (N) KidProfile (1) ──── (N) EducationRecord
                                 (1) ──── (N) KidActivity
                                 (1) ──── (N) KidCompetition
                                 (1) ──── (N) SummerCamp
                                 (1) ──── (N) VacationTrip
                                 (1) ──── (N) GrowthMeasurement
                                 (1) ──── (N) TimelineEvent
                                 (1) ──── (N) Photo
```

## Entities

### 1. User

New entity (not in OSDK). Created on first Google OAuth sign-in.

| Column      | Type         | Nullable | Notes                       |
| ----------- | ------------ | -------- | --------------------------- |
| id          | UUID (PK)    | No       | Auto-generated              |
| email       | VARCHAR(255) | No       | From Google profile, unique |
| displayName | VARCHAR(255) | No       | From Google profile         |
| avatarUrl   | VARCHAR(512) | Yes      | Google profile picture URL  |
| googleId    | VARCHAR(128) | No       | Google sub claim, unique    |
| createdAt   | TIMESTAMP    | No       | Auto-set                    |
| updatedAt   | TIMESTAMP    | No       | Auto-set                    |

**Validation**: email must be valid format; googleId must be unique.

### 2. KidProfile

Maps from OSDK `kidProfile`. Added `userId` FK for multi-tenancy.

| Column      | Type             | Nullable | Notes                              |
| ----------- | ---------------- | -------- | ---------------------------------- |
| id          | UUID (PK)        | No       | Replaces OSDK `kidId` (was string) |
| userId      | UUID (FK → User) | No       | Owner of this kid profile          |
| firstName   | VARCHAR(100)     | No       |                                    |
| lastName    | VARCHAR(100)     | Yes      |                                    |
| dateOfBirth | DATE             | No       |                                    |
| gender      | VARCHAR(20)      | No       |                                    |
| nickname    | VARCHAR(100)     | Yes      |                                    |
| notes       | TEXT             | Yes      |                                    |
| createdAt   | TIMESTAMP        | No       | Auto-set                           |
| updatedAt   | TIMESTAMP        | No       | Auto-set                           |

**Validation**: firstName max 100 chars; dateOfBirth must be in the past; gender must be one of Male/Female/Other.

### 3. EducationRecord

Maps from OSDK `educationRecord`.

| Column      | Type                   | Nullable | Notes                       |
| ----------- | ---------------------- | -------- | --------------------------- |
| id          | UUID (PK)              | No       | Replaces OSDK `educationId` |
| kidId       | UUID (FK → KidProfile) | No       |                             |
| schoolName  | VARCHAR(255)           | No       |                             |
| grade       | VARCHAR(50)            | Yes      | e.g., "1st Grade", "Pre-K"  |
| startDate   | DATE                   | No       |                             |
| endDate     | DATE                   | Yes      |                             |
| achievement | VARCHAR(255)           | Yes      | e.g., "Honor Roll"          |
| description | TEXT                   | Yes      |                             |
| category    | VARCHAR(100)           | Yes      | e.g., "School", "Tutoring"  |
| createdAt   | TIMESTAMP              | No       | Auto-set                    |

**Validation**: startDate must not be after endDate if both present.

### 4. KidActivity

Maps from OSDK `kidActivity`.

| Column       | Type                   | Nullable | Notes                          |
| ------------ | ---------------------- | -------- | ------------------------------ |
| id           | UUID (PK)              | No       | Replaces OSDK `activityId`     |
| kidId        | UUID (FK → KidProfile) | No       |                                |
| activityName | VARCHAR(255)           | No       |                                |
| activityType | VARCHAR(100)           | No       | e.g., "Sports", "Music", "Art" |
| provider     | VARCHAR(255)           | Yes      | Instructor/organization        |
| startDate    | DATE                   | No       |                                |
| endDate      | DATE                   | Yes      |                                |
| dayOfWeek    | VARCHAR(20)            | Yes      | e.g., "Monday"                 |
| description  | TEXT                   | Yes      |                                |
| createdAt    | TIMESTAMP              | No       | Auto-set                       |

**Validation**: activityName max 255 chars; startDate required.

### 5. KidCompetition

Maps from OSDK `kidCompetition`.

| Column          | Type                   | Nullable | Notes                                |
| --------------- | ---------------------- | -------- | ------------------------------------ |
| id              | UUID (PK)              | No       | Replaces OSDK `competitionId`        |
| kidId           | UUID (FK → KidProfile) | No       |                                      |
| competitionName | VARCHAR(255)           | No       |                                      |
| competitionType | VARCHAR(100)           | Yes      | e.g., "Science Fair", "Spelling Bee" |
| eventDate       | DATE                   | No       |                                      |
| result          | VARCHAR(255)           | Yes      | e.g., "Gold Medal"                   |
| placement       | VARCHAR(50)            | Yes      | e.g., "1st Place"                    |
| description     | TEXT                   | Yes      |                                      |
| createdAt       | TIMESTAMP              | No       | Auto-set                             |

**Validation**: eventDate required; competitionName max 255 chars.

### 6. SummerCamp

Maps from OSDK `summerCamp`.

| Column      | Type                   | Nullable | Notes                         |
| ----------- | ---------------------- | -------- | ----------------------------- |
| id          | UUID (PK)              | No       | Replaces OSDK `campId`        |
| kidId       | UUID (FK → KidProfile) | No       |                               |
| campName    | VARCHAR(255)           | No       |                               |
| campType    | VARCHAR(100)           | Yes      | e.g., "Day Camp", "Overnight" |
| location    | VARCHAR(255)           | Yes      |                               |
| startDate   | DATE                   | No       |                               |
| endDate     | DATE                   | Yes      |                               |
| highlights  | TEXT                   | Yes      |                               |
| description | TEXT                   | Yes      |                               |
| createdAt   | TIMESTAMP              | No       | Auto-set                      |

**Validation**: startDate must not be after endDate if both present.

### 7. VacationTrip

Maps from OSDK `vacationTrip`. Supports "Family" trip type (not tied to one kid).

| Column      | Type                   | Nullable | Notes                                  |
| ----------- | ---------------------- | -------- | -------------------------------------- |
| id          | UUID (PK)              | No       | Replaces OSDK `tripId`                 |
| kidId       | UUID (FK → KidProfile) | Yes      | NULL for "Family" trips                |
| userId      | UUID (FK → User)       | No       | Owner (for family trips without kidId) |
| tripType    | VARCHAR(50)            | No       | "Family" or "Individual"               |
| tripName    | VARCHAR(255)           | No       |                                        |
| destination | VARCHAR(255)           | No       |                                        |
| startDate   | DATE                   | No       |                                        |
| endDate     | DATE                   | Yes      |                                        |
| highlights  | TEXT                   | Yes      |                                        |
| description | TEXT                   | Yes      |                                        |
| createdAt   | TIMESTAMP              | No       | Auto-set                               |

**Validation**: tripType must be "Family" or "Individual"; if "Individual" then kidId is required; destination required.

### 8. GrowthMeasurement

Maps from OSDK `growthMeasurement`.

| Column          | Type                   | Nullable | Notes                         |
| --------------- | ---------------------- | -------- | ----------------------------- |
| id              | UUID (PK)              | No       | Replaces OSDK `measurementId` |
| kidId           | UUID (FK → KidProfile) | No       |                               |
| measurementDate | DATE                   | No       |                               |
| heightInches    | DECIMAL(5,2)           | Yes      | Height in inches              |
| weightLbs       | DECIMAL(5,2)           | Yes      | Weight in pounds              |
| notes           | TEXT                   | Yes      |                               |
| createdAt       | TIMESTAMP              | No       | Auto-set                      |

**Validation**: heightInches > 0 if present; weightLbs > 0 if present; at least one of height or weight must be provided.

### 9. TimelineEvent

Maps from OSDK `timelineEvent`. Auto-generated by backend when entities are created.

| Column          | Type                   | Nullable | Notes                                           |
| --------------- | ---------------------- | -------- | ----------------------------------------------- |
| id              | UUID (PK)              | No       | Replaces OSDK `eventId`                         |
| kidId           | UUID (FK → KidProfile) | Yes      | NULL for family trips                           |
| userId          | UUID (FK → User)       | No       | Owner                                           |
| eventDate       | DATE                   | No       |                                                 |
| eventTitle      | VARCHAR(255)           | No       |                                                 |
| eventCategory   | VARCHAR(50)            | No       | education/activity/competition/camp/trip/growth |
| description     | TEXT                   | Yes      |                                                 |
| relatedEntityId | UUID                   | Yes      | FK to the source entity (polymorphic)           |
| createdAt       | TIMESTAMP              | No       | Auto-set                                        |

**Validation**: eventCategory must be one of the defined categories.

### 10. Photo

New entity (not in OSDK). Stores blob metadata.

| Column            | Type                   | Nullable | Notes                         |
| ----------------- | ---------------------- | -------- | ----------------------------- |
| id                | UUID (PK)              | No       | Auto-generated                |
| kidId             | UUID (FK → KidProfile) | No       |                               |
| relatedEntityId   | UUID                   | Yes      | Polymorphic FK to any entity  |
| relatedEntityType | VARCHAR(50)            | Yes      | e.g., "education", "activity" |
| blobPath          | VARCHAR(512)           | No       | Azure Blob Storage path       |
| fileName          | VARCHAR(255)           | No       | Original file name            |
| contentType       | VARCHAR(100)           | No       | e.g., "image/jpeg"            |
| fileSizeBytes     | INTEGER                | No       |                               |
| createdAt         | TIMESTAMP              | No       | Auto-set                      |

**Validation**: contentType must be image/jpeg or image/png; fileSizeBytes ≤ 10485760 (10 MB).

## Migration Notes

- All OSDK string PKs (`kidId`, `educationId`, etc.) become UUIDs auto-generated by PostgreSQL
- `kidProfile` gains a `userId` FK for multi-tenancy (was implicit in OSDK)
- `vacationTrip` gains `userId` FK and allows `kidId = NULL` for family trips
- `timelineEvent` gains `userId` FK for the same reason
- `photo` is entirely new — OSDK had mediaset scopes but no photo storage was implemented
- TypeORM `@CreateDateColumn()` and `@UpdateDateColumn()` handle timestamps
- All FK cascades: delete a kid → cascades to all child records and their timeline events
