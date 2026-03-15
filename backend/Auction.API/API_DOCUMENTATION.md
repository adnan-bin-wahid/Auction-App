# Sealed-Bid Auction System - Backend API Documentation

## Overview

The Sealed-Bid Auction System is a web-based application that enables users to participate in online auctions by submitting confidential bids on products. This backend API is built using ASP.NET Core Web API and SQL Server.

## Technology Stack

- **Backend Framework**: ASP.NET Core 10.0
- **Database**: Microsoft SQL Server
- **ORM**: Entity Framework Core 10.0
- **Authentication**: Password hashing with BCrypt.Net
- **API Documentation**: Swagger/OpenAPI

## API Endpoints

### 1. Users Controller (`/api/users`)

#### Register User

- **POST** `/api/users/register`
- **Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

- **Response**: User DTO with UserId, Name, Email, and Role

#### Login User

- **POST** `/api/users/login`
- **Request Body**:

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

- **Response**: User DTO with authentication information

#### Get User by ID

- **GET** `/api/users/{id}`
- **Response**: User DTO

### 2. Products Controller (`/api/products`)

#### Get All Products

- **GET** `/api/products`
- **Response**: Array of Product DTOs

#### Get Product by ID

- **GET** `/api/products/{id}`
- **Response**: Single Product DTO

#### Create Product (Admin Only)

- **POST** `/api/products`
- **Request Body**:

```json
{
  "name": "Vintage Camera",
  "description": "A pristine vintage film camera from the 1970s",
  "actualPrice": 450.0,
  "startingPrice": 200.0,
  "imageUrl": "https://example.com/camera.jpg"
}
```

- **Response**: Created Product DTO with ID

#### Update Product (Admin Only)

- **PUT** `/api/products/{id}`
- **Request Body**: Same as Create Product
- **Response**: 204 No Content

#### Delete Product (Admin Only)

- **DELETE** `/api/products/{id}`
- **Response**: 204 No Content

### 3. Auctions Controller (`/api/auctions`)

#### Get All Auctions

- **GET** `/api/auctions`
- **Response**: Array of Auction DTOs with Product information

#### Get Auction by ID

- **GET** `/api/auctions/{id}`
- **Response**: Single Auction DTO

#### Get Auction by Product ID

- **GET** `/api/auctions/product/{productId}`
- **Response**: Single Auction DTO for the product

#### Create Auction (Admin Only)

- **POST** `/api/auctions`
- **Request Body**:

```json
{
  "productId": 1,
  "startTime": "2026-03-20T10:00:00Z",
  "endTime": "2026-03-22T10:00:00Z"
}
```

- **Response**: Created Auction DTO

#### Update Auction Status (Admin Only)

- **PUT** `/api/auctions/{id}/status`
- **Request Body**: `"Ended"` (or other status)
- **Response**: 204 No Content

#### Check if Auction is Active

- **GET** `/api/auctions/{id}/active`
- **Response**: Boolean indicating active status

### 4. Bids Controller (`/api/bids`)

#### Place a Bid

- **POST** `/api/bids`
- **Request Body**:

```json
{
  "auctionId": 1,
  "userId": 5,
  "bidAmount": 250.0
}
```

- **Rules**:
  - Auction must be active
  - Bid amount must be >= starting price
  - User must be registered
- **Response**: Created Bid DTO

#### Get Bid by ID

- **GET** `/api/bids/{id}`
- **Response**: Single Bid DTO

#### Get All Bids for Auction (Admin Only)

- **GET** `/api/bids/auction/{auctionId}`
- **Response**: Array of Bid DTOs

#### Get User's Bid History

- **GET** `/api/bids/user/{userId}/history`
- **Response**: Array of Bid DTOs (most recent first)

#### Get Highest Bid for Auction

- **GET** `/api/bids/auction/{auctionId}/highest`
- **Response**: Highest Bid DTO (or earliest if tied)

### 5. Winners Controller (`/api/winners`)

#### Assign Winner (Admin Only)

- **POST** `/api/winners/assign-winner/{auctionId}`
- **Rules**:
  - Auction must be ended
  - Winner is determined by highest bid (earliest if tied)
  - Can only assign one winner per auction
- **Response**: Winner information with ID

#### Get Winner by Auction ID

- **GET** `/api/winners/auction/{auctionId}`
- **Response**: Winner DTO with User and Product information

#### Get Winners for User

- **GET** `/api/winners/user/{userId}`
- **Response**: Array of Winner DTOs

#### Delete Winner (Admin Only)

- **DELETE** `/api/winners/{winnerId}`
- **Response**: 204 No Content

## Database Schema

### Users Table

```sql
UserId (PK)
Name
Email (Unique)
PasswordHash
Role ('Admin' or 'User')
CreatedAt
```

### Products Table

```sql
ProductId (PK)
Name
Description
ActualPrice
StartingPrice
ImageUrl
CreatedAt
```

### Auctions Table

```sql
AuctionId (PK)
ProductId (FK)
StartTime
EndTime
Status ('Active', 'Ended', 'Closed')
```

### Bids Table

```sql
BidId (PK)
AuctionId (FK)
UserId (FK)
BidAmount
BidTime
```

### AuctionWinners Table

```sql
WinnerId (PK)
AuctionId (FK, Unique)
UserId (FK)
BidId (FK)
WinningAmount
AssignedAt
```

## Auction Rules

1. **Sealed Bids**: Users cannot see bids placed by other users
2. **Admin Visibility**: Admins can view all bids for an auction
3. **Minimum Bid**: Bids must be >= product's starting price
4. **Winner Selection**: Highest valid bid wins the auction
5. **Tie Breaking**: If two bids are equal, the earliest bid wins
6. **Auction Timeline**:
   - Bids can only be placed during active auction period
   - Status changes from 'Active' to 'Ended' after end time
   - Winners are assigned after auction ends

## Setup Instructions

### 1. Database Setup

1. Open SQL Server Management Studio
2. Execute the `SealedBidAuctionDB_Init.sql` script to create database and tables
3. Update the connection string in `appsettings.json` if your SQL Server instance is different

### 2. Backend Setup

```bash
cd backend/Auction.API/Auction.API
dotnet restore
dotnet build
```

### 3. Run the Backend

```bash
dotnet run
```

The API will be available at `https://localhost:7000` (HTTPS) and the Swagger UI at `https://localhost:7000/swagger`

## CORS Configuration

The API is configured to accept requests from the Angular frontend running on `http://localhost:4200`. This can be modified in `Program.cs` if needed.

## Authentication Notes

**Current Status**: Basic authentication with password hashing

- Passwords are hashed using BCrypt.Net
- For production, implement JWT token-based authentication
- Add authorization attributes to admin-only endpoints

## Error Handling

All endpoints return appropriate HTTP status codes:

- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request (validation errors)
- 404: Not Found
- 500: Internal Server Error

## Development Notes

- UserId in bid requests is for development purposes
- In production, extract UserId from JWT claims
- Consider implementing middleware for authentication
- Add audit logging for sensitive operations
- Implement proper authorization checks for admin endpoints

## Next Steps

1. Implement JWT authentication
2. Add authorization filters for admin-only endpoints
3. Implement email notifications for winners
4. Add bid history queries with pagination
5. Create background job for automatic auction closing
6. Add transaction management for concurrent bids
