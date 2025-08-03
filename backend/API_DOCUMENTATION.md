# API Documentation

## Content Endpoints

### Get All Contents

- **GET** `/api/v1/content`
- **Description**: Get all contents with pagination and optional filtering
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `genre` (optional): Filter by genre ID
- **Response**: List of contents with pagination info

### Get Contents by User

- **GET** `/api/v1/content/user/:userId`
- **Description**: Get all contents created by a specific user
- **Path Parameters**:
  - `userId`: The ID of the user whose contents to retrieve
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response**:

```json
{
  "success": true,
  "data": {
    "contents": [
      {
        "_id": "content_id",
        "title": "Video Title",
        "description": "Video description",
        "mediaUrl": "https://example.com/video.mp4",
        "mediaType": "video",
        "thumbnail": "https://example.com/thumbnail.jpg",
        "duration": 120,
        "views": 1000,
        "likes": [],
        "shares": [],
        "isPublic": true,
        "tags": ["tag1", "tag2"],
        "location": "New York",
        "genre": {
          "_id": "genre_id",
          "name": "Comedy",
          "slug": "comedy"
        },
        "user": {
          "_id": "user_id",
          "fullName": "John Doe",
          "profilePicture": "https://example.com/profile.jpg"
        },
        "commentCount": 5,
        "likeCount": 10,
        "shareCount": 2,
        "isLiked": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
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

### Get Contents by Genre

- **GET** `/api/v1/content/genre/:genreId`
- **Description**: Get all contents filtered by genre
- **Path Parameters**:
  - `genreId`: The ID of the genre to filter by
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response**: List of contents filtered by genre with pagination info

### Get Content by ID

**GET** `/content/:id`

- Returns specific content with all related data
- Increments view count

### Update Content

**PUT** `/content/:id`

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "isPublic": false,
  "tags": ["updated", "tags"]
}
```

### Delete Content

**DELETE** `/content/:id`

### Search Contents

**GET** `/content/search?q=searchterm&page=1&limit=10`

- Search by title, description, or tags

## Comment Endpoints

### Create Comment

**POST** `/comments`

```json
{
  "content": "contentId",
  "text": "Great video!",
  "parentComment": "parentCommentId" // optional for replies
}
```

### Get Comments by Content

**GET** `/comments/content/:contentId?page=1&limit=20`

- Returns paginated comments for a specific content
- Includes user info and like count

### Get Comment by ID

**GET** `/comments/:id`

- Returns specific comment with user data and replies

### Get Replies for Comment

**GET** `/comments/:commentId/replies?page=1&limit=10`

- Returns paginated replies for a specific comment

### Update Comment

**PUT** `/comments/:id`

```json
{
  "text": "Updated comment text"
}
```

### Delete Comment

**DELETE** `/comments/:id`

### Get Comments by User

**GET** `/comments/user/:userId?page=1&limit=20`

- Returns all comments by a specific user

## Like Endpoints

### Toggle Like

**POST** `/likes/toggle`

```json
{
  "contentId": "contentId", // for content likes
  "commentId": "commentId", // for comment likes
  "type": "content" // or "comment"
}
```

### Check if User Liked

**GET** `/likes/check?contentId=id&type=content`
**GET** `/likes/check?commentId=id&type=comment`

### Get Like Count

**GET** `/likes/count?contentId=id&type=content`
**GET** `/likes/count?commentId=id&type=comment`

### Get Users Who Liked

**GET** `/likes/users?contentId=id&type=content&page=1&limit=20`
**GET** `/likes/users?commentId=id&type=comment&page=1&limit=20`

### Get Likes by User

**GET** `/likes/user/:userId?type=content&page=1&limit=20`

- type is optional (content, comment, or both)

### Remove Like

**DELETE** `/likes`

```json
{
  "contentId": "contentId",
  "commentId": "commentId",
  "type": "content"
}
```

## Share Endpoints

### Create Share

**POST** `/shares`

```json
{
  "content": "contentId",
  "platform": "facebook",
  "shareUrl": "https://facebook.com/share/..."
}
```

### Get Shares by Content

**GET** `/shares/content/:contentId?page=1&limit=20`

- Returns paginated shares for a specific content

### Get Share Count

**GET** `/shares/content/:contentId/count`

- Returns total share count for content

### Get Shares by User

**GET** `/shares/user/:userId?page=1&limit=20`

- Returns all shares by a specific user

### Get Shares by Platform

**GET** `/shares/platform/:platform?page=1&limit=20`

- Returns all shares for a specific platform

### Get Share Statistics

**GET** `/shares/content/:contentId/stats`

- Returns share statistics grouped by platform

## Authentication Endpoints

### Register User

**POST** `/auth/register`

```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "profilePicture": "https://example.com/profile.jpg"
}
```

### Login User

**POST** `/auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get All Users

**GET** `/auth/`

- Returns all users in the system

### Get User by ID

**GET** `/auth/:id`

- Returns a specific user by ID

### Update User

**PATCH** `/auth/:id`

**Form Data:**

- `fullname` (optional): Updated full name
- `email` (optional): Updated email
- `password` (optional): New password
- `role` (optional): Updated role
- `profilePicture` (optional): Profile picture file

**Example:**

```bash
PATCH /auth/64f1234567890abcdef12345
Content-Type: multipart/form-data

Form Data:
- fullname: "Updated Name"
- email: "updated@example.com"
- password: "newpassword123"
- role: "user"
- profilePicture: [file upload]
```

**Note:** The `profilePicture` field accepts file uploads. If provided, it will be uploaded and the URL will be automatically updated in the user profile.

### Delete User

**DELETE** `/auth/:id`

- Deletes a user by ID

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {
    // response data
  },
  "message": "Success message" // optional
}
```

## Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information" // optional
}
```

## Pagination

Most list endpoints support pagination:

- `page`: Page number (default: 1)
- `limit`: Items per page (default varies by endpoint)

Response includes pagination info:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Database Models

### Content Model

```typescript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  title: String,
  description: String,
  mediaUrl: String,
  mediaType: "video" | "image",
  thumbnail: String,
  duration: Number,
  views: Number,
  likes: Number,
  shares: Number,
  isPublic: Boolean,
  tags: [String],
  location: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model

```typescript
{
  _id: ObjectId,
  content: ObjectId (ref: Content),
  user: ObjectId (ref: User),
  text: String,
  parentComment: ObjectId (ref: Comment), // for replies
  likes: Number,
  replies: [ObjectId],
  isEdited: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Like Model

```typescript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  content: ObjectId (ref: Content), // for content likes
  comment: ObjectId (ref: Comment), // for comment likes
  type: "content" | "comment",
  createdAt: Date
}
```

### Share Model

```typescript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  content: ObjectId (ref: Content),
  platform: String,
  shareUrl: String,
  createdAt: Date
}
```

## Features Implemented

✅ **Content Management**

- Create, read, update, delete content
- Support for video and image content
- Search functionality
- Pagination
- View count tracking

✅ **Comment System**

- Create, read, update, delete comments
- Nested replies support
- Comment like system
- Pagination

✅ **Like System**

- Like/unlike content and comments
- Like count tracking
- Check if user liked
- Get users who liked

✅ **Share System**

- Share content to different platforms
- Share count tracking
- Share statistics
- Platform-specific sharing

✅ **User Management**

- User registration and login
- User profile management

✅ **Aggregated Data**

- Content with comment count, like count, share count
- User information included in responses
- Optimized database queries with aggregation

✅ **Database Optimization**

- Proper indexing for performance
- Efficient aggregation pipelines
- Relationship management

## Future Enhancements

- **Real-time features**: WebSocket integration for live comments and likes
- **Media upload**: File upload service for videos and images
- **Advanced search**: Elasticsearch integration
- **Recommendation system**: Content recommendation algorithm
- **Analytics**: Detailed analytics and insights
- **Moderation**: Content and comment moderation system
- **Notifications**: Push notifications for interactions
