# Posts API Documentation

## What is Posts API?

Posts API allows you to manage social media posts in the application. You can create, read, update, and delete posts, with optional team context and media attachments.

## Table of Contents

- [Getting Started](#getting-started)
- [Managing Posts](#managing-posts)
  - [Create Post](#1-create-post)
  - [Get Posts](#2-get-posts)
  - [Update Post](#3-update-post)
  - [Delete Post](#4-delete-post)
- [Handling Errors](#handling-errors)
- [Code Examples](#code-examples)

## Getting Started

Before using the API, make sure you have:

1. Authentication token (login first!)
2. Basic understanding of JSON format
3. Knowledge of API methods (GET, POST, PUT, DELETE)

## Managing Posts

### 1. Create Post

Create a new post with optional media and scheduling:

```http
POST /api/posts
```

Supports both JSON and multipart/form-data formats.

#### Using JSON

Request Headers:

```
Content-Type: application/json
Authorization: Bearer <your_token>
```

Request Body:

```json
{
  "content": "Your post content here",
  "teamId": "team_123", // Optional: Post in team context
  "mediaUrl": "https://example.com/image.jpg", // Optional
  "scheduledAt": "2024-03-20T10:00:00Z" // Optional
}
```

#### Using Form Data

Request Headers:

```
Content-Type: multipart/form-data
Authorization: Bearer <your_token>
```

Form Fields:

- `content` (required): Post content text
- `teamId` (optional): Team ID
- `mediaUrl` (optional): Media URL
- `scheduledAt` (optional): Schedule time

Success Response (201 Created):

```json
{
  "id": "post_123",
  "content": "Your post content here",
  "mediaUrl": "https://example.com/image.jpg",
  "scheduledAt": "2024-03-20T10:00:00Z",
  "teamId": "team_123",
  "createdAt": "2024-03-19T10:00:00Z",
  "updatedAt": "2024-03-19T10:00:00Z"
}
```

### 2. Get Posts

Retrieve posts with optional filters:

```http
GET /api/posts
```

Request Headers:

```
Authorization: Bearer <your_token>
```

Query Parameters:

- `teamId` (optional): Filter posts by team
- `status` (optional): Filter by post status

Example:

```
GET /api/posts?teamId=team_123&status=PUBLISHED
```

Success Response:

```json
[
  {
    "id": "post_123",
    "content": "First post",
    "mediaUrl": "https://example.com/image1.jpg",
    "teamId": "team_123",
    "status": "PUBLISHED",
    "createdAt": "2024-03-19T10:00:00Z"
  },
  {
    "id": "post_124",
    "content": "Second post",
    "teamId": "team_123",
    "status": "PUBLISHED",
    "createdAt": "2024-03-19T11:00:00Z"
  }
]
```

### 3. Update Post

Use this endpoint to modify an existing post:

```http
PUT /api/posts/{postId}
```

What you need to include:

1. **Headers** (required)

   ```
   Content-Type: application/json
   Authorization: Bearer <your_token>
   ```

2. **Request Body** (in JSON format)
   ```json
   {
     "content": "Your post content here",
     "mediaUrl": "https://example.com/image.jpg", // Optional: Link to media
     "scheduledAt": "2024-03-20T10:00:00Z" // Optional: Schedule post
   }
   ```

Success response:

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

### 4. Delete Post

Remove a post permanently:

```http
DELETE /api/posts/{postId}
```

What you need:

1. **Headers**
   ```
   Authorization: Bearer <your_token>
   ```

Success response:

```json
{
  "message": "Post deleted successfully"
}
```

## Handling Errors

When something goes wrong, the API will provide clear error messages:

| Code | Meaning      | Causes & Solutions                                                               |
| ---- | ------------ | -------------------------------------------------------------------------------- |
| 400  | Bad Request  | - Invalid JSON format<br>- Missing required fields<br>➡️ Check your request data |
| 401  | Unauthorized | - Missing token<br>- Expired token<br>➡️ Login again for new token               |
| 403  | Forbidden    | - Not post owner<br>- Not authorized<br>➡️ Check post ownership                  |
| 404  | Not Found    | - Post doesn't exist<br>- Wrong post ID<br>➡️ Verify the post ID                 |
| 500  | Server Error | ➡️ Try again later or contact support                                            |

## Code Examples

### Example 1: Updating a Post (JavaScript)

```javascript
// Function to update a post
async function updatePost(postId, content, mediaUrl = null, scheduledAt = null) {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer your_token_here",
      },
      body: JSON.stringify({
        content,
        mediaUrl,
        scheduledAt,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update post!");
    }

    const data = await response.json();
    console.log("Post updated:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// How to use:
updatePost("post_123", "Updated content here!", "https://example.com/new-image.jpg")
  .then((post) => {
    // Post updated successfully!
  })
  .catch((error) => {
    // Oops, something went wrong!
  });
```

### Example 2: Deleting a Post (JavaScript)

```javascript
// Function to delete a post
async function deletePost(postId) {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer your_token_here",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete post!");
    }

    const data = await response.json();
    console.log("Post deleted:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// How to use:
deletePost("post_123")
  .then((result) => {
    // Post deleted successfully!
  })
  .catch((error) => {
    // Oops, something went wrong!
  });
```

## Tips & Tricks

1. **Content Guidelines**

   - Keep content within reasonable length
   - Validate media URLs before sending
   - Use ISO 8601 format for dates

2. **Handle Errors Properly**

   ```javascript
   if (!response.ok) {
     const error = await response.json();
     console.error("Error:", error.message);
     // Show user-friendly error message
   }
   ```

3. **Scheduling Posts**

   - Use valid future dates
   - Consider timezone differences
   - Verify schedule timing

4. **Testing**
   - Test with various content types
   - Verify media handling
   - Check scheduling behavior

## Need Help?

- Check API status at [status page](http://status.api.com)
- Email us at support@api.com
- Open an issue on GitHub repository

> 🎉 **Happy Coding!** Don't be afraid to experiment and learn from errors.
