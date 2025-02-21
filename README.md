# CRUD API for Social Media Post Management

A Next.js-based API for managing social media posts and team collaborations.

## Table of Contents

- [Setup](#setup)
- [API Documentation](#api-documentation)
  - [Posts API](#posts-api)
  - [Teams API](#teams-api)
  - [Auth API](#auth-api)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AbdurrahmanFaris-Rizqullah/todo-list-social-api.git
cd todo-list-social-api
```

### 2. Install Dependencies

```bash
npm install / npm i
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="your_database_url"

# Authentication
JWT_SECRET="your_jwt_secret"

# Optional: External Services
MEDIA_STORAGE_URL="your_media_storage_url" # If using media uploads
```

### 4. Database Setup

```bash
# Run migrations
npx prisma migrate dev
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The API will be available at [http://localhost:3000/api](http://localhost:3000/api)

## API Documentation

### Posts API

Manage your social media posts with our Posts API.

#### Quick Start Guide

1. Make sure you have an authentication token
2. Include the token in all API requests
3. Use JSON format for request bodies
4. Handle responses appropriately

#### Authentication

All API endpoints require authentication. Include your token in request headers:

```
Authorization: Bearer <your_token>
```

> ⚠️ Never share your authentication token or commit it to version control.

#### Available Endpoints

##### 1. Create Post

Create a new post with optional media and scheduling:

```http
POST /api/posts
```

Request Headers:

- `Content-Type: application/json` (or multipart/form-data)
- `Authorization: Bearer <token>` (required)

Request Body (JSON):

```json
{
  "content": "Your post content here",
  "teamId": "team_123", // Optional
  "mediaUrl": "https://example.com/image.jpg", // Optional
  "scheduledAt": "2024-03-20T10:00:00Z" // Optional
}
```

##### 2. Get Posts

Retrieve posts with optional filters:

```http
GET /api/posts?teamId=team_123&status=PUBLISHED
```

Request Headers:

- `Authorization: Bearer <token>` (required)

##### 3. Update Post

Modify an existing post's content, media, or schedule:

```http
PUT /api/posts/{postId}
```

Request Headers:

- `Content-Type: application/json` (required)
- `Authorization: Bearer <token>` (required)

Request Body:

```json
{
  "content": "Your post content here",
  "mediaUrl": "https://example.com/image.jpg", // Optional: Link to media
  "scheduledAt": "2024-03-20T10:00:00Z" // Optional: Schedule post
}
```

Success Response:

```json
{
  "id": "post_123",
  "content": "Your post content here",
  "mediaUrl": "https://example.com/image.jpg",
  "scheduledAt": "2024-03-20T10:00:00Z",
  "createdAt": "2024-03-19T10:00:00Z",
  "updatedAt": "2024-03-19T10:00:00Z"
}
```

##### 4. Delete Post

Remove a post permanently:

```http
DELETE /api/posts/{postId}
```

Request Headers:

- `Authorization: Bearer <token>` (required)

Success Response:

```json
{
  "message": "Post deleted successfully"
}
```

#### Error Handling

The API uses standard HTTP status codes and returns detailed error messages:

| Code | Meaning      | Common Causes                         |
| ---- | ------------ | ------------------------------------- |
| 400  | Bad Request  | Invalid JSON, missing required fields |
| 401  | Unauthorized | Missing or invalid token              |
| 403  | Forbidden    | Not allowed to modify this post       |
| 404  | Not Found    | Post doesn't exist                    |
| 500  | Server Error | Internal system error                 |

> 📝 For more detailed documentation, check out [docs/api/posts.md](docs/api/posts.md)

### Teams API

Collaborate with team members using our Teams API.

#### Quick Start Guide

1. Create a team
2. Add members to your team
3. Manage team posts and permissions

#### Available Endpoints

##### 1. Create Team

Create a new team:

```http
POST /api/teams
```

Request Headers:

- `Content-Type: application/json` (required)
- `Authorization: Bearer <token>` (required)

Request Body:

```json
{
  "name": "My Awesome Team",
  "description": "Team description here"
}
```

Success Response:

```json
{
  "id": "team_123",
  "name": "My Awesome Team",
  "description": "Team description here",
  "createdAt": "2024-03-19T10:00:00Z",
  "ownerId": "user_123"
}
```

##### 2. Add Team Member

Add a user to your team:

```http
POST /api/teams/{teamId}/members
```

Request Headers:

- `Content-Type: application/json` (required)
- `Authorization: Bearer <token>` (required)

Request Body:

```json
{
  "userId": "user_456",
  "role": "MEMBER" // or "ADMIN"
}
```

Success Response:

```json
{
  "message": "Member added successfully",
  "teamMember": {
    "userId": "user_456",
    "teamId": "team_123",
    "role": "MEMBER",
    "joinedAt": "2024-03-19T10:00:00Z"
  }
}
```

##### 3. Remove Team Member

Remove a member from your team:

```http
DELETE /api/teams/{teamId}/members/{userId}
```

Request Headers:

- `Authorization: Bearer <token>` (required)

Success Response:

```json
{
  "message": "Member removed successfully"
}
```

#### Error Handling

| Code | Meaning      | Common Causes                  |
| ---- | ------------ | ------------------------------ |
| 400  | Bad Request  | Invalid role, duplicate member |
| 401  | Unauthorized | Missing or invalid token       |
| 403  | Forbidden    | Not authorized to manage team  |
| 404  | Not Found    | Team or user not found         |
| 500  | Server Error | Internal system error          |

> 📝 For more detailed documentation, check out [docs/api/teams.md](docs/api/teams.md)

### Auth API

Secure authentication endpoints for user registration and login.

#### Quick Start Guide

1. Use `multipart/form-data` format for all requests
2. Never send credentials in URL parameters
3. Handle authentication tokens securely

#### Available Endpoints

##### 1. Register

Create a new user account:

```http
POST /api/auth/register
```

Request Headers:

- `Content-Type: multipart/form-data` (required)

Form Fields:

- `email` (required): Valid email address
- `password` (required): User password

Success Response (201 Created):

```json
{
  "id": "user_123",
  "email": "user@example.com"
}
```

##### 2. Login

Authenticate and get access token:

```http
POST /api/auth/login
```

Request Headers:

- `Content-Type: multipart/form-data` (required)

Form Fields:

- `email` (required): Registered email address
- `password` (required): User password

Success Response:

```json
{
  "token": "your_auth_token_here",
  "user": {
    "id": "user_123",
    "email": "user@example.com"
  }
}
```

#### Error Handling

| Code | Meaning      | Common Causes                  |
| ---- | ------------ | ------------------------------ |
| 400  | Bad Request  | Invalid format, missing fields |
| 401  | Unauthorized | Wrong credentials              |
| 404  | Not Found    | Account doesn't exist          |
| 405  | Not Allowed  | Wrong HTTP method              |
| 500  | Server Error | Internal system error          |

> 📝 For more detailed documentation, check out [docs/api/auth.md](docs/api/auth.md)
