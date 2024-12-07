## User Settings

### Get User Settings

- **URL**: `/api/user/settings`
- **Method**: `GET`
- **Description**: Retrieves the current user's settings
- **Authentication**: Required
- **Success Response**:
  - **Code**: 200
  - **Content**: 
    \`\`\`json
    {
      "username": "string",
      "email": "string",
      "emailVerified": boolean,
      "twoFactorEnabled": boolean
    }
    \`\`\`
- **Error Response**:
  - **Code**: 401
  - **Content**: `{ "error": "Unauthorized" }`
  - **Code**: 404
  - **Content**: `{ "error": "User not found" }`
  - **Code**: 500
  - **Content**: `{ "error": "Internal server error" }`

### Update User Settings

- **URL**: `/api/user/settings`
- **Method**: `PUT`
- **Description**: Updates the current user's settings
- **Authentication**: Required
- **Request Body**:
  \`\`\`json
  {
    "username": "string"
  }
  \`\`\`
- **Success Response**:
  - **Code**: 200
  - **Content**: 
    \`\`\`json
    {
      "username": "string",
      "email": "string",
      "emailVerified": boolean,
      "twoFactorEnabled": boolean
    }
    \`\`\`
- **Error Response**:
  - **Code**: 401
  - **Content**: `{ "error": "Unauthorized" }`
  - **Code**: 500
  - **Content**: `{ "error": "Internal server error" }`

## Two-Factor Authentication

### Enable Two-Factor Authentication

- **URL**: `/api/user/two-factor/enable`
- **Method**: `POST`
- **Description**: Enables two-factor authentication for the current user
- **Authentication**: Required
- **Success Response**:
  - **Code**: 200
  - **Content**: `{ "success": true, "secret": "string" }`
- **Error Response**:
  - **Code**: 401
  - **Content**: `{ "error": "Unauthorized" }`
  - **Code**: 500
  - **Content**: `{ "error": "Failed to enable two-factor authentication" }`

### Disable Two-Factor Authentication

- **URL**: `/api/user/two-factor/disable`
- **Method**: `POST`
- **Description**: Disables two-factor authentication for the current user
- **Authentication**: Required
- **Success Response**:
  - **Code**: 200
  - **Content**: `{ "success": true }`
- **Error Response**:
  - **Code**: 401
  - **Content**: `{ "error": "Unauthorized" }`
  - **Code**: 500
  - **Content**: `{ "error": "Failed to disable two-factor authentication" }`

