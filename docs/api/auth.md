# Authentication API Documentation

## Overview

The Authentication API handles user registration and login functionality. It provides secure endpoints for creating new accounts and authenticating users.

## Table of Contents

- [Getting Started](#getting-started)
- [Endpoints](#endpoints)
  - [Register](#1-register)
  - [Login](#2-login)
- [Error Handling](#error-handling)
- [Security Guidelines](#security-guidelines)

## Getting Started

All authentication endpoints:

1. Accept `multipart/form-data` format only
2. Require secure transmission of credentials
3. Validate email format and required fields

## Endpoints

### 1. Register

Create a new user account:

```http
POST /api/auth/register
```

Request Headers:

```
Content-Type: multipart/form-data
```

Form Fields:

- `email` (required): Valid email address
- `password` (required): User password

Success Response (201 Created):

```json
{
  "id": "user_123",
  "email": "user@example.com"
  // Additional user data...
}
```

### 2. Login

Authenticate an existing user:

```http
POST /api/auth/login
```

Request Headers:

```
Content-Type: multipart/form-data
```

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
    // Additional user data...
  }
}
```

## Error Handling

| Code | Meaning      | Causes & Solutions                                                              |
| ---- | ------------ | ------------------------------------------------------------------------------- |
| 400  | Bad Request  | - Missing required fields<br>- Invalid email format<br>➡️ Check your input data |
| 401  | Unauthorized | - Invalid credentials<br>➡️ Verify email and password                           |
| 404  | Not Found    | - Account not found<br>➡️ Register first or check email                         |
| 405  | Not Allowed  | - Wrong HTTP method<br>➡️ Use POST method only                                  |

## Security Guidelines

1. **Never Include Credentials in URL**

   - Always send credentials in request body
   - Never use URL parameters for sensitive data

2. **Password Security**

   - Use strong passwords
   - Never store passwords in plaintext
   - Handle tokens securely

3. **Error Handling**
   - Don't expose sensitive information in errors
   - Use generic error messages for security

## Code Examples

### Registration Example

```javascript
async function registerUser(email, password) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}
```

### Login Example

```javascript
async function loginUser(email, password) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    // Store token securely
    localStorage.setItem("authToken", data.token);
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
```

## Tips & Best Practices

1. **Form Validation**

   - Validate email format client-side
   - Check for required fields
   - Sanitize inputs

2. **Token Management**

   - Store tokens securely
   - Implement token refresh
   - Clear tokens on logout

3. **Error Handling**
   - Show user-friendly messages
   - Log errors securely
   - Handle network issues

> 🔐 **Security Note**: Always use HTTPS in production and never log sensitive data.
