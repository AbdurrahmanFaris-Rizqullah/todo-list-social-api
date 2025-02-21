# Posts API Documentation

## What is Posts API?

Posts API allows you to manage social media posts in the application. You can update existing posts, schedule posts, and manage post content.

## Table of Contents

- [Getting Started](#getting-started)
- [Managing Posts](#managing-posts)
- [Handling Errors](#handling-errors)
- [Code Examples](#code-examples)

## Getting Started

Before using the API, make sure you have:

1. Authentication token (login first!)
2. Basic understanding of JSON format
3. Knowledge of API methods (GET, POST, PUT, DELETE)

## Managing Posts

### 1. Update Post

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

### 2. Delete Post

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
