# Teams API Documentation

## What is Teams API?

Teams API allows you to create and manage teams in the application. You can create new teams, invite members, and manage their roles.

## Table of Contents

- [Getting Started](#getting-started)
- [Creating Teams](#creating-teams)
- [Managing Members](#managing-members)
- [Handling Errors](#handling-errors)
- [Code Examples](#code-examples)

## Getting Started

Before using the API, make sure you have:

1. Authentication token (login first!)
2. Basic understanding of JSON format
3. Knowledge of API methods (GET, POST, PUT, DELETE)

## Creating Teams

### How to Create a New Team

Use this endpoint to create a new team:

```http
POST /api/teams
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
     "name": "Your Team Name",
     "description": "Tell us about your team"
   }
   ```

If successful, you'll get a response like this:

```json
{
  "id": "team_123",
  "name": "Your Team Name",
  "description": "Tell us about your team",
  "createdAt": "2024-03-19T10:00:00Z",
  "ownerId": "user_123"
}
```

> 💡 **Tip**: Choose a clear and descriptive team name for easy recognition!

## Managing Members

### 1. Adding Team Members

To invite new members to your team:

```http
POST /api/teams/{teamId}/members
```

What you need to prepare:

1. **Headers**

   ```
   Content-Type: application/json
   Authorization: Bearer <your_token>
   ```

2. **Request Body**
   ```json
   {
     "userId": "user_to_invite_id",
     "role": "MEMBER" // Can be "MEMBER" or "ADMIN"
   }
   ```

Success response:

```json
{
  "message": "Member added successfully!",
  "teamMember": {
    "userId": "user_to_invite_id",
    "teamId": "team_123",
    "role": "MEMBER",
    "joinedAt": "2024-03-19T10:00:00Z"
  }
}
```

> 🔑 **Roles**:
>
> - `MEMBER`: Can view and participate in team activities
> - `ADMIN`: Can manage team and its members

### 2. Removing Team Members

To remove a member from the team:

```http
DELETE /api/teams/{teamId}/members/{userId}
```

What you need:

1. **Headers**
   ```
   Authorization: Bearer <your_token>
   ```

Success response:

```json
{
  "message": "Member removed successfully"
}
```

## Handling Errors

When something goes wrong, the API will provide clear error messages:

| Code | Meaning      | Causes & Solutions                                                                         |
| ---- | ------------ | ------------------------------------------------------------------------------------------ |
| 400  | Bad Request  | - Incomplete data<br>- Invalid JSON format<br>- Invalid role<br>➡️ Check your request data |
| 401  | Unauthorized | - Missing token<br>- Expired token<br>➡️ Login again for new token                         |
| 403  | Forbidden    | - Not team admin<br>- Not team owner<br>➡️ Ask admin/owner for permission                  |
| 404  | Not Found    | - Wrong team ID<br>- Wrong user ID<br>➡️ Verify the IDs                                    |
| 500  | Server Error | ➡️ Try again later or contact support                                                      |

## Code Examples

### Example 1: Creating a New Team (JavaScript)

```javascript
// Function to create a team
async function createNewTeam(teamName, description) {
  try {
    const response = await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer your_token_here",
      },
      body: JSON.stringify({
        name: teamName,
        description: description,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create team!");
    }

    const data = await response.json();
    console.log("Team created:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// How to use:
createNewTeam("Awesome Team", "Team for our website project")
  .then((team) => {
    // Team created successfully!
  })
  .catch((error) => {
    // Oops, something went wrong!
  });
```

### Example 2: Adding a Member (JavaScript)

```javascript
// Function to add a member
async function addTeamMember(teamId, userId, role = "MEMBER") {
  try {
    const response = await fetch(`/api/teams/${teamId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer your_token_here",
      },
      body: JSON.stringify({
        userId: userId,
        role: role,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add member!");
    }

    const data = await response.json();
    console.log("Member added:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// How to use:
addTeamMember("team_123", "user_456")
  .then((result) => {
    // Member added successfully!
  })
  .catch((error) => {
    // Oops, something went wrong!
  });
```

## Tips & Tricks

1. **Always Check Your Token**

   - Ensure token is valid
   - Store token securely
   - Never share your token

2. **Handle Errors Properly**

   ```javascript
   if (!response.ok) {
     const error = await response.json();
     console.error("Error:", error.message);
     // Show user-friendly error message
   }
   ```

3. **Input Validation**

   - Check team name length
   - Ensure description isn't empty
   - Verify valid user IDs

4. **Testing**
   - Try all scenarios (success/fail)
   - Test with different roles
   - Check responses for each case

## Need Help?

- Check API status at [status page](http://status.api.com)
- Email us at support@api.com
- Open an issue on GitHub repository

> 🎉 **Happy Coding!** Don't be afraid to experiment and learn from errors.
