# Genre API Documentation

## Overview

The Genre API provides endpoints for managing content genres, allowing users to categorize and filter content by genre.

## Base URL

```
http://localhost:4000/api/v1/genres
```

## Authentication

- Public endpoints: No authentication required
- Admin endpoints: Requires authentication and admin role

## Endpoints

### 1. Get All Genres

**GET** `/api/v1/genres`

Get all genres with pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `activeOnly` (optional): Show only active genres (default: true)

**Response:**

```json
{
  "success": true,
  "data": {
    "genres": [
      {
        "_id": "genre_id",
        "name": "Comedy",
        "description": "Funny and entertaining content",
        "slug": "comedy",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    }
  }
}
```

### 2. Get Active Genres

**GET** `/api/v1/genres/active`

Get all active genres (for dropdowns, etc.).

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "genre_id",
      "name": "Comedy",
      "description": "Funny and entertaining content",
      "slug": "comedy",
      "isActive": true
    }
  ]
}
```

### 3. Get Popular Genres

**GET** `/api/v1/genres/popular`

Get popular genres.

**Query Parameters:**

- `limit` (optional): Number of genres to return (default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "genre_id",
      "name": "Comedy",
      "description": "Funny and entertaining content",
      "slug": "comedy",
      "isActive": true
    }
  ]
}
```

### 4. Search Genres

**GET** `/api/v1/genres/search`

Search genres by name or description.

**Query Parameters:**

- `q` (required): Search query
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "genres": [
      {
        "_id": "genre_id",
        "name": "Comedy",
        "description": "Funny and entertaining content",
        "slug": "comedy",
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

### 5. Get Genre by ID

**GET** `/api/v1/genres/:id`

Get a specific genre by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "genre_id",
    "name": "Comedy",
    "description": "Funny and entertaining content",
    "slug": "comedy",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Get Genre by Slug

**GET** `/api/v1/genres/slug/:slug`

Get a specific genre by slug.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "genre_id",
    "name": "Comedy",
    "description": "Funny and entertaining content",
    "slug": "comedy",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 7. Create Genre (Admin Only)

**POST** `/api/v1/genres`

Create a new genre.

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "name": "New Genre",
  "description": "Description of the new genre"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "genre_id",
    "name": "New Genre",
    "description": "Description of the new genre",
    "slug": "new-genre",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Genre created successfully"
}
```

### 8. Update Genre (Admin Only)

**PUT** `/api/v1/genres/:id`

Update an existing genre.

**Headers:**

```
Authorization: Bearer <token>
```

**Body:**

```json
{
  "name": "Updated Genre Name",
  "description": "Updated description"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "genre_id",
    "name": "Updated Genre Name",
    "description": "Updated description",
    "slug": "updated-genre-name",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Genre updated successfully"
}
```

### 9. Delete Genre (Admin Only)

**DELETE** `/api/v1/genres/:id`

Soft delete a genre (sets isActive to false).

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Genre deleted successfully"
}
```

### 10. Hard Delete Genre (Admin Only)

**DELETE** `/api/v1/genres/:id/hard`

Permanently delete a genre.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Genre permanently deleted"
}
```

## Content-Genre Integration

### Updated Content Endpoints

#### 1. Create Content (Updated)

**POST** `/api/v1/content`

**Body:**

```json
{
  "title": "My Video",
  "description": "Description of my video",
  "mediaUrl": "https://example.com/video.mp4",
  "mediaType": "video",
  "genre": "genre_id", // Required field
  "tags": ["tag1", "tag2"],
  "isPublic": true
}
```

#### 2. Get All Contents (Updated)

**GET** `/api/v1/content`

**Query Parameters:**

- `genre` (optional): Filter by genre ID
- `page` (optional): Page number
- `limit` (optional): Items per page

#### 3. Get Contents by Genre

**GET** `/api/v1/content/genre/:genreId`

Get all contents for a specific genre.

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**

```json
{
  "success": true,
  "data": {
    "contents": [
      {
        "_id": "content_id",
        "title": "My Video",
        "description": "Description",
        "mediaUrl": "https://example.com/video.mp4",
        "mediaType": "video",
        "genre": {
          "_id": "genre_id",
          "name": "Comedy",
          "slug": "comedy"
        },
        "user": {
          "_id": "user_id",
          "fullname": "John Doe",
          "profilePicture": "https://example.com/avatar.jpg"
        },
        "commentCount": 5,
        "likeCount": 10,
        "shareCount": 2,
        "isLiked": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### 4. Search Contents (Updated)

**GET** `/api/v1/content/search`

**Query Parameters:**

- `q` (required): Search query
- `genre` (optional): Filter by genre ID
- `page` (optional): Page number
- `limit` (optional): Items per page

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Genre is required"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Genre not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Error creating genre",
  "error": "Error details"
}
```

## Seeding Genres

To populate the database with initial genres, run:

```bash
npm run seed:genres
```

This will create 15 default genres:

- Comedy
- Drama
- Action
- Romance
- Horror
- Sci-Fi
- Documentary
- Music
- Sports
- Travel
- Food
- Technology
- Fashion
- Gaming
- Education

## Usage Examples

### Frontend Integration

1. **Get genres for dropdown:**

```javascript
const response = await fetch("/api/v1/genres/active");
const genres = await response.json();
```

2. **Filter content by genre:**

```javascript
const response = await fetch("/api/v1/content?genre=genre_id");
const contents = await response.json();
```

3. **Search content within a genre:**

```javascript
const response = await fetch("/api/v1/content/search?q=funny&genre=genre_id");
const contents = await response.json();
```

4. **Create content with genre:**

```javascript
const response = await fetch("/api/v1/content", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "My Video",
    description: "Description",
    mediaUrl: "https://example.com/video.mp4",
    mediaType: "video",
    genre: "genre_id",
  }),
});
```
