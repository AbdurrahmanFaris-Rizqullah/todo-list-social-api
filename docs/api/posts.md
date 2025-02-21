# Posts API Documentation

## Overview

The Posts API provides a RESTful interface for managing posts in the application. This documentation covers all available endpoints, their usage, and examples.

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Update Post](#update-post)
  - [Delete Post](#delete-post)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Authentication

All endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer <your_token>
```

> 🔐 Make sure to keep your token secure and never expose it in client-side code.

## Endpoints

### Update Post

Updates the content and metadata of an existing post.

**URL**: `/api/posts/{postId}`  
**Method**: `PUT`  
**Auth required**: Yes

#### Request Headers

- `Content-Type: application/json` (required)
- `Authorization: Bearer <token>` (required)

#### Request Body Parameters

| Field       | Type   | Description                       | Required | Constraints    |
| ----------- | ------ | --------------------------------- | -------- | -------------- |
| content     | string | The post content text             | Yes      | Max 1000 chars |
| mediaUrl    | string | URL to attached media             | No       | Valid URL      |
| scheduledAt | string | ISO 8601 date for scheduled posts | No       | Future date    |

Example Request Body:

```json
{
  "content": "Check out this amazing sunset! 🌅",
  "mediaUrl": "https://example.com/sunset.jpg",
  "scheduledAt": "2024-03-20T10:00:00Z"
}
```

#### Success Response

**Code**: `200 OK`

```json
{
  "id": "post_123",
  "content": "Check out this amazing sunset! 🌅",
  "mediaUrl": "https://example.com/sunset.jpg",
  "scheduledAt": "2024-03-20T10:00:00Z",
  "createdAt": "2024-03-19T10:00:00Z",
  "updatedAt": "2024-03-19T10:00:00Z"
}
```

### Delete Post

Permanently removes a post from the system.

**URL**: `/api/posts/{postId}`  
**Method**: `DELETE`  
**Auth required**: Yes

#### Request Headers

- `Authorization: Bearer <token>` (required)

#### Success Response

**Code**: `200 OK`

```json
{
  "message": "Post deleted successfully"
}
```

## Error Handling

The API uses conventional HTTP response codes:

### Invalid Request

**Code**: `400 Bad Request`

```json
{
  "error": "Content-Type must be application/json",
  "code": "INVALID_CONTENT_TYPE"
}
```

### Unauthorized

**Code**: `401 Unauthorized`

```json
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

### Forbidden

**Code**: `403 Forbidden`

```json
{
  "error": "User not authorized to modify this post",
  "code": "FORBIDDEN"
}
```

### Not Found

**Code**: `404 Not Found`

```json
{
  "error": "Post not found",
  "code": "NOT_FOUND"
}
```

### Server Error

**Code**: `500 Internal Server Error`

```json
{
  "error": "Internal server error"
}
```

## Best Practices

1. **Always validate input**: Ensure your content meets the length requirements
2. **Handle errors gracefully**: Check for and handle all possible error responses
3. **Use proper date formats**: Use ISO 8601 format for dates
4. **Media URLs**: Ensure media URLs are accessible and valid
5. **Rate limiting**: Be mindful of API rate limits

## Examples

### JavaScript/TypeScript

```typescript
// Update a post
async function updatePost(postId: string, content: string) {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error("Failed to update post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

// Delete a post
async function deletePost(postId: string) {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}
```

> 💡 Remember to replace `token` with your actual authentication token.
