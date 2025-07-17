---
layout: default
title: API Documentation
---

# API Documentation

The Tiation CMS provides a comprehensive RESTful API for managing content programmatically.

## Base URL

```
https://your-cms-domain.com/api
```

## Authentication

All API requests require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Endpoints

### Content Management

#### GET /api/content
Retrieve all content items.

**Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page
- `type` (optional): Filter by content type

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Sample Content",
      "type": "article",
      "status": "published",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

#### POST /api/content
Create new content item.

**Request Body:**
```json
{
  "title": "New Article",
  "type": "article",
  "content": "Article content...",
  "status": "draft"
}
```

#### PUT /api/content/:id
Update existing content item.

#### DELETE /api/content/:id
Delete content item.

### User Management

#### GET /api/users
Retrieve all users (admin only).

#### POST /api/users
Create new user (admin only).

### Authentication

#### POST /api/auth/login
User login endpoint.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "admin"
  }
}
```

## Error Responses

All errors follow a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```
