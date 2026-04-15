# Feature Specification: Azure Full-Stack Migration

**Feature Branch**: `001-azure-fullstack-migration`
**Created**: 2026-04-14
**Status**: Draft
**Input**: User description: "Migrate Palantir OSDK app to Azure full-stack: React SPA on Static Web Apps, NestJS API on Container Apps, PostgreSQL, Blob Storage, Google OAuth, GitHub Actions CI/CD"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Sign in with Google and see my kids' dashboard (Priority: P1)

As a parent, I want to sign in using my Google account so that I can securely access my children's growth records from any device. After signing in, I land on a dashboard showing my kids' profiles, recent activity counts, and quick navigation.

**Why this priority**: Authentication is the foundation — nothing else works without it. The dashboard is the entry point providing immediate value.

**Independent Test**: Can be fully tested by signing in with a Google account, landing on the dashboard, and seeing kid profile cards with stats. Delivers secure, personalized access.

**Acceptance Scenarios**:

1. **Given** I am not signed in, **When** I visit the app, **Then** I see a "Sign in with Google" button
2. **Given** I click "Sign in with Google", **When** Google authentication succeeds, **Then** I am redirected to the dashboard showing my kids' profiles
3. **Given** I am a first-time user, **When** I sign in, **Then** a new account is created for me and I see an empty dashboard with an "Add your first child" prompt
4. **Given** I am a returning user with 2 kids, **When** I sign in, **Then** I see both kids' cards with their names, ages, and activity counts

---

### User Story 2 - Manage kid profiles dynamically (Priority: P1)

As a parent, I want to add, edit, and view profiles for each of my children so that the app tracks multiple kids with accurate details (name, date of birth, gender, nickname).

**Why this priority**: Kid profiles are the core entity — all other records depend on having kids to associate with.

**Independent Test**: Can be fully tested by creating a new kid profile, editing it, and verifying the details persist and appear on the dashboard and sidebar.

**Acceptance Scenarios**:

1. **Given** I am signed in with no kids, **When** I click "Add Child", **Then** I see a form for first name, last name, date of birth, gender, and nickname
2. **Given** I fill out the kid form correctly, **When** I submit, **Then** the new kid appears in the sidebar and on the dashboard
3. **Given** I have a kid profile, **When** I navigate to their profile page, **Then** I see their details and tabbed sections for Education, Activities, Competitions, Camps, Trips, and Growth

---

### User Story 3 - Add and browse records across categories (Priority: P1)

As a parent, I want to add records (education, activities, competitions, camps, trips, growth measurements) for a child using a quick-add dialog so that I can track their milestones and history over time.

**Why this priority**: Record creation and browsing is the core value proposition — the reason the app exists.

**Independent Test**: Can be fully tested by selecting a kid, opening quick-add, filling in an education record, submitting, and seeing it in the kid's profile Education tab and in the Timeline.

**Acceptance Scenarios**:

1. **Given** I am viewing a kid's profile, **When** I click "Quick Add" and select "Education", **Then** I see a form with school name, grade, start date, and description fields
2. **Given** I submit a valid education record, **When** I view the kid's Education tab, **Then** the new record appears in the list
3. **Given** I submit any category record, **When** I view the Timeline, **Then** a corresponding timeline event appears for that record
4. **Given** I add a growth measurement (height and weight), **When** I visit Growth Charts, **Then** the new data point appears on the chart

---

### User Story 4 - View the timeline of all events (Priority: P2)

As a parent, I want to see a chronological timeline of all events across my children, filterable by kid and category, so I can browse their history in a visual, grouped view.

**Why this priority**: Timeline is a key differentiating feature with the living spine design, but depends on having records to display.

**Independent Test**: Can be fully tested by having multiple records across categories and kids, then viewing the timeline with various filter combinations.

**Acceptance Scenarios**:

1. **Given** I have events for multiple kids, **When** I visit the Timeline page, **Then** I see events grouped by month/year with a visual timeline spine and colored dots per category
2. **Given** I filter by kid "Nirek", **When** the timeline refreshes, **Then** only Nirek's events and family events appear
3. **Given** I filter by category "Education", **When** the timeline refreshes, **Then** only education events appear
4. **Given** today's date is visible in the timeline range, **When** I view the timeline, **Then** a pulsing "Today" heartbeat marker appears

---

### User Story 5 - View growth charts (Priority: P2)

As a parent, I want to see line charts showing my children's height and weight over time so I can track their physical growth trends.

**Why this priority**: Visualization adds insight on top of raw data — valuable but depends on having growth measurements first.

**Independent Test**: Can be fully tested by having growth measurement records and viewing the Growth Charts page to see rendered line charts.

**Acceptance Scenarios**:

1. **Given** a kid has multiple growth measurements, **When** I visit Growth Charts, **Then** I see height and weight line charts with data points plotted over time
2. **Given** I select "Both Kids" view, **When** the charts render, **Then** both kids' measurements appear as separate colored lines on the same charts
3. **Given** a kid has only one measurement, **When** I view their chart, **Then** a single point is plotted with latest stats displayed as cards

---

### User Story 6 - Upload and view photos for records (Priority: P3)

As a parent, I want to optionally attach photos to any record (education, activity, competition, camp, trip) so I can document my children's experiences visually.

**Why this priority**: Photo support enhances the app but is not required for core functionality. Requires blob storage integration.

**Independent Test**: Can be fully tested by creating a record with a photo attachment, then viewing the record and seeing the photo displayed.

**Acceptance Scenarios**:

1. **Given** I am creating a new education record, **When** I see the form, **Then** there is an optional "Add Photo" field
2. **Given** I select a JPEG image under 10 MB, **When** I submit the record, **Then** the photo uploads and a thumbnail appears with the record
3. **Given** I try to upload a file larger than 10 MB, **When** I select the file, **Then** I see a validation error and the upload is blocked
4. **Given** a record has a photo, **When** I view the record details, **Then** the photo is displayed at reasonable quality

---

### User Story 7 - Automated deployment via CI/CD (Priority: P2)

As a developer, I want code pushed to the main branch to automatically build and deploy the frontend to Static Web Apps and the backend to Container Apps so that the app stays up-to-date without manual deployment steps.

**Why this priority**: CI/CD ensures sustainable ongoing development — critical for maintainability but not for initial functionality.

**Independent Test**: Can be fully tested by merging a code change to main and verifying the deployment pipelines succeed and the live app reflects the change.

**Acceptance Scenarios**:

1. **Given** I push frontend changes to main, **When** the GitHub Actions workflow runs, **Then** the React SPA is built and deployed to Static Web Apps
2. **Given** I push backend changes to main, **When** the GitHub Actions workflow runs, **Then** a Docker image is built, pushed to the container registry, and deployed to Container Apps
3. **Given** a test fails in CI, **When** the workflow runs, **Then** deployment is blocked and the failure is reported

---

### Edge Cases

- What happens when the user's Google OAuth token expires? The app redirects to Google sign-in again transparently.
- What happens when the backend is scaled to zero and a request arrives? The first request has cold-start latency (up to ~10 seconds); subsequent requests are fast.
- What happens when a user tries to access another user's kids? The API returns 403 Forbidden; data is scoped by userId.
- What happens when a photo upload fails mid-stream? The record is created without the photo; user can retry the photo upload.
- What happens when the database is unreachable? The API returns 503 Service Unavailable with a user-friendly error.
- What happens when the user has no kids and views Timeline or Growth Charts? Empty state messages are displayed with a prompt to add a child first.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST authenticate users via Google OAuth 2.0 and issue session tokens
- **FR-002**: System MUST support creating, reading, updating, and deleting kid profiles scoped to the authenticated user
- **FR-003**: System MUST support creating and reading records for 6 categories: Education, Activities, Competitions, Camps, Trips, and Growth Measurements — each linked to a specific kid
- **FR-004**: System MUST automatically generate a timeline event whenever any category record is created
- **FR-005**: System MUST display a filterable timeline (by kid and by category) with events grouped chronologically
- **FR-006**: System MUST render line charts for height and weight growth data, supporting individual and combined kid views
- **FR-007**: System MUST support optional photo uploads (JPEG, PNG; max 10 MB) attached to any category record
- **FR-008**: System MUST store uploaded photos in cloud blob storage and serve them via time-limited secure URLs
- **FR-009**: System MUST isolate all data by user — a user can only access their own kids and records
- **FR-010**: System MUST preserve the existing design system: Warm Parchment palette, Fraunces/Source Sans 3 fonts, saffron accent, living timeline spine with pulsing "Today" marker
- **FR-011**: System MUST support the "family" trip concept — trips tagged as family-wide rather than per-kid
- **FR-012**: System MUST have automated CI/CD pipelines that build, test, and deploy on code push to main

### Key Entities

- **User**: An authenticated Google account holder; has email, display name, avatar URL; owns kid profiles
- **Kid Profile**: A child being tracked; has first name, last name, date of birth, gender, nickname, notes; belongs to a User
- **Education Record**: School/learning milestone; has school name, grade, dates, achievement, description; belongs to a Kid
- **Kid Activity**: Sport/hobby/lesson; has activity name, type, provider, dates, schedule, description; belongs to a Kid
- **Kid Competition**: Contest/event result; has competition name, type, event date, result, placement, description; belongs to a Kid
- **Summer Camp**: Camp experience; has camp name, type, location, dates, highlights, description; belongs to a Kid
- **Vacation Trip**: Travel record; has trip name, type (Family/Individual), destination, dates, highlights, description; belongs to a Kid (or "family")
- **Growth Measurement**: Physical data point; has measurement date, height (inches), weight (lbs), notes; belongs to a Kid
- **Timeline Event**: Denormalized event record; has event date, title, category, description, related entity reference; belongs to a Kid
- **Photo**: Uploaded image; has blob URL, file size, content type; linked to a Kid and optionally to a specific record

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can sign in with Google and reach the dashboard within 5 seconds
- **SC-002**: All existing functionality (dashboard, timeline, kid profiles, growth charts, quick-add) works identically to the Palantir version — no feature regression
- **SC-003**: A new record created via quick-add appears in both the kid's profile tab and the timeline within 2 seconds
- **SC-004**: Growth charts render correctly with multiple data points for 2+ children on the combined view
- **SC-005**: Photo uploads complete within 10 seconds for files up to 10 MB
- **SC-006**: The backend scales to zero when idle and responds to the first request within 15 seconds (cold start)
- **SC-007**: CI/CD pipelines complete build and deploy within 5 minutes of a push to main
- **SC-008**: No user can access another user's data — verified by attempting cross-user API calls and receiving 403 responses
- **SC-009**: Monthly Azure infrastructure cost remains under $25 for typical personal usage
