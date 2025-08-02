# TikTok-like Backend Application

A comprehensive backend API for a TikTok-like video sharing application built with Node.js, TypeScript, Express, and MongoDB.

## Features

### 🎥 Content Management

- Upload and manage video/image content
- Support for video and image media types
- Content search and filtering
- View count tracking
- Public/private content settings
- Content tagging and categorization

### 💬 Comment System

- Create, read, update, delete comments
- Nested reply system
- Comment like functionality
- Comment editing tracking
- Pagination for comments

### ❤️ Like System

- Like/unlike content and comments
- Real-time like count tracking
- Check if user has liked
- Get users who liked content/comments
- Efficient like management

### 📤 Share System

- Share content to different platforms
- Share count tracking
- Platform-specific sharing
- Share statistics and analytics

### 👤 User Management

- User registration and authentication
- User profile management
- User content and activity tracking

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Architecture**: MVC Pattern
- **API**: RESTful API

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts                 # Database connection
│   ├── controllers/
│   │   ├── auth.controller.ts     # Authentication controller
│   │   ├── content.controller.ts  # Content management
│   │   ├── comment.controller.ts  # Comment management
│   │   ├── like.controller.ts     # Like management
│   │   └── share.controller.ts    # Share management
│   ├── models/
│   │   ├── user.model.ts          # User model
│   │   ├── content.model.ts       # Content model
│   │   ├── comment.model.ts       # Comment model
│   │   ├── like.model.ts          # Like model
│   │   └── share.model.ts         # Share model
│   ├── routes/
│   │   ├── auth.routes.ts         # Auth routes
│   │   ├── content.routes.ts      # Content routes
│   │   ├── comment.routes.ts      # Comment routes
│   │   ├── like.routes.ts         # Like routes
│   │   └── share.routes.ts        # Share routes
│   ├── services/
│   │   ├── user.service.ts        # User business logic
│   │   ├── content.service.ts     # Content business logic
│   │   ├── comment.service.ts     # Comment business logic
│   │   ├── like.service.ts        # Like business logic
│   │   └── share.service.ts       # Share business logic
│   └── index.ts                   # Main application file
├── package.json
├── tsconfig.json
└── README.md
```

## Database Models

### User Model

```typescript
{
  _id: ObjectId,
  fullname: String,
  email: String (unique),
  password: String (hashed),
  profilePicture: String,
  role: String (default: "user"),
  createdAt: Date,
  updatedAt: Date
}
```

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

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Content

- `POST /content` - Create new content
- `GET /content` - Get all contents (paginated)
- `GET /content/:id` - Get content by ID
- `GET /content/user/:userId` - Get contents by user
- `PUT /content/:id` - Update content
- `DELETE /content/:id` - Delete content
- `GET /content/search` - Search contents

### Comments

- `POST /comments` - Create comment
- `GET /comments/content/:contentId` - Get comments by content
- `GET /comments/:id` - Get comment by ID
- `GET /comments/:commentId/replies` - Get replies for comment
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment
- `GET /comments/user/:userId` - Get comments by user

### Likes

- `POST /likes/toggle` - Toggle like on content/comment
- `GET /likes/check` - Check if user liked
- `GET /likes/count` - Get like count
- `GET /likes/users` - Get users who liked
- `GET /likes/user/:userId` - Get likes by user
- `DELETE /likes` - Remove like

### Shares

- `POST /shares` - Create share
- `GET /shares/content/:contentId` - Get shares by content
- `GET /shares/content/:contentId/count` - Get share count
- `GET /shares/user/:userId` - Get shares by user
- `GET /shares/platform/:platform` - Get shares by platform
- `GET /shares/content/:contentId/stats` - Get share statistics

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   MONGO_URI=mongodb://localhost:27017/tiktok_app
   PORT=4000
   NODE_ENV=development
   ```

4. **Database Setup**

   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGO_URI` in your `.env` file

5. **Run the application**

   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## Database Indexes

The application includes optimized database indexes for better performance:

### Content Indexes

- `{ user: 1, createdAt: -1 }` - User content queries
- `{ tags: 1 }` - Tag-based searches
- `{ isPublic: 1, createdAt: -1 }` - Public content queries

### Comment Indexes

- `{ content: 1, createdAt: -1 }` - Content comments
- `{ user: 1, createdAt: -1 }` - User comments
- `{ parentComment: 1 }` - Comment replies

### Like Indexes

- `{ user: 1, content: 1 }` - User content likes (unique)
- `{ user: 1, comment: 1 }` - User comment likes (unique)
- `{ content: 1, type: 1 }` - Content likes
- `{ comment: 1, type: 1 }` - Comment likes

### Share Indexes

- `{ content: 1, createdAt: -1 }` - Content shares
- `{ user: 1, createdAt: -1 }` - User shares
- `{ platform: 1 }` - Platform shares

## Performance Optimizations

### Aggregation Pipelines

- Efficient data aggregation for content with comments, likes, and shares
- Optimized user data lookups
- Real-time count calculations

### Database Queries

- Proper indexing for fast queries
- Pagination support for large datasets
- Efficient relationship management

### Response Optimization

- Structured response format
- Pagination metadata
- Error handling and validation

## Error Handling

The application includes comprehensive error handling:

- **Validation Errors**: Input validation and sanitization
- **Database Errors**: Connection and query error handling
- **Authentication Errors**: Unauthorized access handling
- **Not Found Errors**: Resource not found responses
- **Server Errors**: Internal server error handling

## Security Features

- **Input Validation**: Request data validation
- **Error Sanitization**: Safe error responses
- **Authentication**: User authentication system
- **Authorization**: Route protection
- **Data Sanitization**: Input sanitization

## Testing

To run tests (when implemented):

```bash
npm test
```

## API Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- **Real-time Features**: WebSocket integration for live updates
- **Media Upload**: File upload service for videos and images
- **Advanced Search**: Elasticsearch integration
- **Recommendation System**: Content recommendation algorithm
- **Analytics**: Detailed analytics and insights
- **Moderation**: Content and comment moderation
- **Notifications**: Push notifications for interactions
- **Caching**: Redis integration for performance
- **Rate Limiting**: API rate limiting
- **Documentation**: Swagger/OpenAPI documentation
