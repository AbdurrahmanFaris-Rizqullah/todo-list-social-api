# CRUD API for to-do list management posts on social media

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Documentation

### Posts API

The Posts API allows you to manage posts in the application. You can perform operations like updating and deleting posts.

#### Quick Start Guide

1. Make sure you have an authentication token
2. Include the token in all API requests
3. Use JSON format for request bodies
4. Handle responses appropriately

#### Authentication

All API endpoints are protected and require authentication. You must include your authentication token in the request headers:

```
Authorization: Bearer <your_token>
```

> ⚠️ Never share your authentication token or commit it to version control.

#### Available Endpoints

##### 1. Update Post

Use this endpoint to modify an existing post's content, media, or schedule.

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

##### 2. Delete Post

Remove a post permanently from the system.

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

| Status | Meaning      | Common Causes                         |
| ------ | ------------ | ------------------------------------- |
| 400    | Bad Request  | Invalid JSON, missing required fields |
| 401    | Unauthorized | Missing or invalid token              |
| 403    | Forbidden    | Not allowed to modify this post       |
| 404    | Not Found    | Post doesn't exist                    |
| 500    | Server Error | Internal system error                 |

#### Code Examples

1. Update a post using cURL:

```bash
curl -X PUT \
  http://localhost:3000/api/posts/123 \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your_token' \
  -d '{
    "content": "Updated content",
    "mediaUrl": "https://example.com/new-image.jpg"
  }'
```

2. Delete a post using cURL:

```bash
curl -X DELETE \
  http://localhost:3000/api/posts/123 \
  -H 'Authorization: Bearer your_token'
```

3. Update a post using JavaScript fetch:

```javascript
const updatePost = async (postId, content) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer your_token",
    },
    body: JSON.stringify({ content }),
  });
  return await response.json();
};
```

> 📝 For more detailed documentation, check out [docs/api/posts.md](docs/api/posts.md)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
