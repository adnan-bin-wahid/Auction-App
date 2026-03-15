# Sealed-Bid Auction System

A modern, full-stack web application for conducting sealed-bid auctions with secure, confidential bidding. Built with Angular frontend, ASP.NET Core backend, and SQL Server database.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [System Rules](#system-rules)

## 🎯 System Overview

The Sealed-Bid Auction System enables users to participate in online auctions by submitting confidential bids without visibility to competitor bids. This ensures fairness and prevents bid manipulation during the auction period.

### User Roles

**Administrator:**

- Add and manage products for auction
- Set auction start and end times
- View all bids placed on auctions
- Select and confirm winning bidders
- Manage auction lifecycle

**User (Bidder):**

- Register and authenticate
- Browse available auction products
- Place sealed bids on active auctions
- View personal bidding history
- View won auctions

## ✨ Key Features

### User Features

- **User Registration & Authentication**: Secure account creation with password hashing
- **Browse Auctions**: View available products and their auction details
- **Place Sealed Bids**: Submit confidential bids that are hidden from other bidders
- **Bid History**: View personal bidding activity across auctions
- **Auction Details**: See product information, starting prices, and auction timelines

### Admin Features

- **Product Management**: Create, edit, and delete products for auction
- **Auction Management**: Set up auctions with custom start/end times
- **Bid Monitoring**: View all bids placed on any auction
- **Winner Selection**: Automatically assign winners based on highest bid
- **Auction Control**: Manage auction status (Active, Ended, Closed)

## 🛠️ Technology Stack

### Frontend

- **Framework**: Angular 21.1.0
- **Language**: TypeScript
- **Styling**: CSS3
- **HTTP Client**: @angular/common/http
- **State Management**: RxJS Observables
- **Architecture**: Standalone Components & Services

### Backend

- **Framework**: ASP.NET Core 10.0
- **Language**: C#
- **Database**: Microsoft SQL Server
- **ORM**: Entity Framework Core 10.0
- **Authentication**: BCrypt.Net Password Hashing
- **API Documentation**: Swagger/OpenAPI

### Database

- **DBMS**: Microsoft SQL Server
- **Tables**: Users, Products, Auctions, Bids, AuctionWinners
- **Relationships**: Foreign keys with cascading deletes

## 📁 Project Structure

```
Auction/
├── backend/
│   └── Auction.API/
│       ├── Auction.API.slnx                 # Solution file
│       └── Auction.API/
│           ├── Program.cs                   # Main application entry
│           ├── Auction.API.csproj           # Project file with dependencies
│           ├── appsettings.json             # Configuration
│           ├── SealedBidAuctionDB_Init.sql  # Database script
│           ├── API_DOCUMENTATION.md         # Detailed API docs
│           ├── Controllers/
│           │   ├── UsersController.cs       # Authentication & user management
│           │   ├── ProductsController.cs    # Product CRUD operations
│           │   ├── AuctionsController.cs    # Auction management
│           │   ├── BidsController.cs        # Bid submission & queries
│           │   └── WinnersController.cs     # Winner selection & tracking
│           ├── Models/
│           │   ├── User.cs                  # User entity
│           │   ├── Product.cs               # Product entity
│           │   ├── Auction.cs               # Auction entity
│           │   ├── Bid.cs                   # Bid entity
│           │   └── AuctionWinner.cs         # Winner tracking entity
│           ├── DTOs/
│           │   ├── AuthDto.cs               # Login/Register DTOs
│           │   ├── ProductDto.cs            # Product DTOs
│           │   ├── AuctionDto.cs            # Auction DTOs
│           │   ├── BidDto.cs                # Bid DTOs
│           │   └── WinnerDto.cs             # Winner DTOs
│           └── Data/
│               └── AppDbContext.cs          # Entity Framework DbContext
├── frontend/
│   └── auction-client/
│       ├── angular.json                     # Angular configuration
│       ├── package.json                     # NPM dependencies
│       ├── src/
│       │   ├── main.ts                      # Application bootstrap
│       │   ├── index.html                   # HTML entry point
│       │   └── app/
│       │       ├── app.ts                   # Root component
│       │       ├── app.html                 # Root template
│       │       ├── app.css                  # Root styles
│       │       ├── app.routes.ts            # Route definitions
│       │       ├── app.config.ts            # App configuration
│       │       ├── components/
│       │       │   ├── login.component.ts
│       │       │   ├── register.component.ts
│       │       │   └── auctions.component.ts
│       │       └── shared/
│       │           ├── models/
│       │           │   ├── user.model.ts
│       │           │   ├── product.model.ts
│       │           │   ├── auction.model.ts
│       │           │   ├── bid.model.ts
│       │           │   └── winner.model.ts
│       │           └── services/
│       │               ├── auth.service.ts
│       │               ├── product.service.ts
│       │               ├── auction.service.ts
│       │               ├── bid.service.ts
│       │               └── winner.service.ts
└── README.md                                # This file
```

## 🚀 Setup Instructions

### Prerequisites

- **Backend**: .NET 10.0 SDK, SQL Server 2019+
- **Frontend**: Node.js 18+, npm 10+
- **Editor**: Visual Studio Code or Visual Studio 2022

### 1. Database Setup

1. Open SQL Server Management Studio (SSMS)
2. Create a new connection to your SQL Server instance
3. Open and execute the file: `backend/Auction.API/SealedBidAuctionDB_Init.sql`

```sql
-- This script creates:
-- - Database: SealedBidAuctionDB
-- - Tables: Users, Products, Auctions, Bids, AuctionWinners
-- - Indexes for performance
-- - Sample admin user and test data
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend/Auction.API/Auction.API

# Restore NuGet packages
dotnet restore

# Build the project
dotnet build

# Run database migrations (if needed)
# dotnet ef database update
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/auction-client

# Install NPM dependencies
npm install
```

## ▶️ Running the Application

### Start Backend API

```bash
cd backend/Auction.API/Auction.API
dotnet run
```

The API will be available at:

- **HTTPS**: `https://localhost:7000`
- **HTTP**: `http://localhost:5000`
- **Swagger UI**: `https://localhost:7000/swagger`

### Start Frontend Application

In a new terminal:

```bash
cd frontend/auction-client
npm start
```

The application will be available at:

- **URL**: `http://localhost:4200`
- Auto-opens in default browser

## 🔌 API Endpoints

### Authentication Endpoints

```
POST   /api/users/register          Register new user
POST   /api/users/login             Authenticate user
GET    /api/users/{id}              Get user details
```

### Product Endpoints

```
GET    /api/products                Get all products
GET    /api/products/{id}           Get specific product
POST   /api/products                Create new product (Admin)
PUT    /api/products/{id}           Update product (Admin)
DELETE /api/products/{id}           Delete product (Admin)
```

### Auction Endpoints

```
GET    /api/auctions                Get all auctions
GET    /api/auctions/{id}           Get specific auction
GET    /api/auctions/product/{productId}    Get auction for product
POST   /api/auctions                Create auction (Admin)
PUT    /api/auctions/{id}/status    Update auction status (Admin)
GET    /api/auctions/{id}/active    Check if auction is active
```

### Bid Endpoints

```
POST   /api/bids                    Place new bid
GET    /api/bids/{id}               Get specific bid
GET    /api/bids/auction/{auctionId}        Get all bids for auction (Admin)
GET    /api/bids/user/{userId}/history     Get user's bid history
GET    /api/bids/auction/{auctionId}/highest Get highest bid
```

### Winner Endpoints

```
POST   /api/winners/assign-winner/{auctionId}  Assign winner (Admin)
GET    /api/winners/auction/{auctionId}        Get winner for auction
GET    /api/winners/user/{userId}              Get user's won auctions
DELETE /api/winners/{winnerId}                 Delete winner (Admin)
```

See [API_DOCUMENTATION.md](backend/Auction.API/API_DOCUMENTATION.md) for detailed endpoint specifications with request/response examples.

## 🏗️ Architecture

### Three-Tier Architecture

```
┌─────────────────────────────────────┐
│         Angular Frontend             │
│  (User Interface & Client Logic)     │
└────────────────┬────────────────────┘
                 │ HTTP/HTTPS
                 │ REST API
┌────────────────▼────────────────────┐
│      ASP.NET Core Web API            │
│  (Business Logic & Data Processing)  │
├────────────────┬────────────────────┤
│  Controllers   │ Services           │
│  DTOs          │ Entity Framework    │
│  Validation    │ Authentication      │
└────────────────┬────────────────────┘
                 │ SQL Provider
┌────────────────▼────────────────────┐
│    Microsoft SQL Server              │
│  (Data Persistence & Storage)        │
├────────────────┬────────────────────┤
│  Users Table          ┌─────────┐   │
│  Products Table       │ Auctions│   │
│  Bids Table       ┌───┴─────────┘   │
│  AuctionWinners ──┤               │
└─────────────────┘   └──────────────┘
```

### Component Communication Flow

```
Angular Component
    ↓
Service (HTTP Request)
    ↓
ASP.NET Core API Controller
    ↓
Business Logic / Validation
    ↓
Entity Framework
    ↓
SQL Server Database
    ↓
Response (Entity → DTO)
    ↓
Angular Service
    ↓
Component (Update View)
```

## 📋 System Rules

### Auction Rules

1. **Sealed Bidding**: Users cannot view bids placed by other participants
2. **Admin Access**: Administrators can view all bids on any auction
3. **Minimum Bid**: Bids must be ≥ product's starting price
4. **Winner Determination**: Highest valid bid wins the auction
5. **Tie Breaking**: If two bids are equal, the earliest bid wins
6. **Bidding Window**: Bids only accepted during active auction period
7. **One Winner**: Each auction has exactly one winner

### Auction Lifecycle

```
Created (Active)
    ↓
Users place sealed bids
    ↓
Auction End Time reached
    ↓
Status changed to "Ended"
    ↓
Admin assigns winner
    ↓
AuctionWinner record created
    ↓
Auction marked as "Closed"
```

### Data Constraints

- User email must be unique
- Bid amount must be ≥ starting price
- Auction end time must be after start time
- One winner per auction
- User role is either 'Admin' or 'User'

## 🔐 Security Considerations

### Current Implementation

- Password hashing with BCrypt.Net
- CORS configured for frontend origin
- Entity constraints on database

### Recommended For Production

- Implement JWT authentication
- Add authorization attributes to protected endpoints
- Use HTTPS everywhere
- Implement rate limiting
- Add audit logging for sensitive operations
- Sanitize user inputs
- Add request validation on backend
- Implement database encryption

## 📝 Database Schema

### Users Table

```
UserId (PK)           - Integer, Primary Key
Name                  - String, Required
Email                 - String, Unique, Required
PasswordHash          - String, Required
Role                  - String ('Admin', 'User')
CreatedAt             - DateTime, Default: Now
```

### Products Table

```
ProductId (PK)        - Integer, Primary Key
Name                  - String, Required
Description           - String
ActualPrice           - Decimal
StartingPrice         - Decimal, Required
ImageUrl              - String
CreatedAt             - DateTime, Default: Now
```

### Auctions Table

```
AuctionId (PK)        - Integer, Primary Key
ProductId (FK)        - Integer, Foreign Key
StartTime             - DateTime, Required
EndTime               - DateTime, Required
Status                - String ('Active', 'Ended', 'Closed')
```

### Bids Table

```
BidId (PK)            - Integer, Primary Key
AuctionId (FK)        - Integer, Foreign Key
UserId (FK)           - Integer, Foreign Key
BidAmount             - Decimal, Required
BidTime               - DateTime, Default: Now
```

### AuctionWinners Table

```
WinnerId (PK)         - Integer, Primary Key
AuctionId (FK)        - Integer, Foreign Key, Unique
UserId (FK)           - Integer, Foreign Key
BidId (FK)            - Integer, Foreign Key
WinningAmount         - Decimal, Required
AssignedAt            - DateTime, Default: Now
```

## 🐛 Troubleshooting

### Backend Won't Start

- Check SQL Server is running: `sqllocaldb info`
- Verify connection string in `appsettings.json`
- Run NuGet restore: `dotnet restore`

### Frontend Can't Connect to API

- Ensure backend is running on port 5000/7000
- Check CORS origin in `Program.cs`
- Browser console for network errors

### Database Connection Failed

- Verify SQL Server instance name in connection string
- Check `Trusted_Connection=True` setting
- Run SQL Server Management Studio to confirm access

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [ASP.NET Core Documentation](https://learn.microsoft.com/aspnet/core)
- [Entity Framework Core](https://learn.microsoft.com/ef/core)
- [SQL Server Documentation](https://learn.microsoft.com/sql/sql-server)

## 📄 License

This project is provided as-is for educational and commercial use.

## ✅ Implementation Checklist

- ✅ Backend Models & Database Schema
- ✅ ASP.NET Core Web API with CRUD operations
- ✅ Authentication with password hashing
- ✅ Frontend Models & Services
- ✅ Angular Components (Login, Register, Auctions)
- ✅ CORS Configuration
- ✅ Database Initialization Script
- ✅ API Documentation
- ✅ Routing & Navigation
- ⏳ Auction Details Component
- ⏳ Bid Placement Component
- ⏳ Admin Product Management
- ⏳ Bid History Component
- ⏳ Winner Assignment UI
- ⏳ JWT Token-based Authentication
- ⏳ Unit Tests
- ⏳ E2E Tests

## 🎓 Next Steps

1. **Enhanced Security**: Implement JWT authentication and role-based authorization
2. **UI Components**: Add auction details, bid placement, and admin dashboards
3. **Business Logic**: Add auction auto-closing, email notifications, and background jobs
4. **Testing**: Write unit and integration tests for critical functions
5. **Deployment**: Containerize and deploy to cloud (Azure, AWS, etc.)
6. **Monitoring**: Add logging, analytics, and error tracking

---

**Last Updated**: March 15, 2026  
**Version**: 1.0.0  
**Status**: Initial Release
