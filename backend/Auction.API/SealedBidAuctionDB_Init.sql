-- Create Database
CREATE DATABASE SealedBidAuctionDB;
GO

USE SealedBidAuctionDB;
GO

-- Create Users Table
CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL DEFAULT 'User',
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Create Products Table
CREATE TABLE Products (
    ProductId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    ActualPrice DECIMAL(18,2),
    StartingPrice DECIMAL(18,2) NOT NULL,
    ImageUrl NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Create Auctions Table
CREATE TABLE Auctions (
    AuctionId INT PRIMARY KEY IDENTITY(1,1),
    ProductId INT NOT NULL,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    Status NVARCHAR(20) DEFAULT 'Active',
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId) ON DELETE CASCADE
);

-- Create Bids Table
CREATE TABLE Bids (
    BidId INT PRIMARY KEY IDENTITY(1,1),
    AuctionId INT NOT NULL,
    UserId INT NOT NULL,
    BidAmount DECIMAL(18,2) NOT NULL,
    BidTime DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (AuctionId) REFERENCES Auctions(AuctionId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- Create AuctionWinners Table
CREATE TABLE AuctionWinners (
    WinnerId INT PRIMARY KEY IDENTITY(1,1),
    AuctionId INT NOT NULL,
    UserId INT NOT NULL,
    BidId INT NOT NULL,
    WinningAmount DECIMAL(18,2) NOT NULL,
    AssignedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (AuctionId) REFERENCES Auctions(AuctionId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (BidId) REFERENCES Bids(BidId)
);

-- Create Indexes for better query performance
CREATE INDEX IX_Auctions_ProductId ON Auctions(ProductId);
CREATE INDEX IX_Bids_AuctionId ON Bids(AuctionId);
CREATE INDEX IX_Bids_UserId ON Bids(UserId);
CREATE INDEX IX_Bids_AuctionId_UserId ON Bids(AuctionId, UserId);
CREATE INDEX IX_AuctionWinners_AuctionId ON AuctionWinners(AuctionId);
CREATE INDEX IX_AuctionWinners_UserId ON AuctionWinners(UserId);

-- Insert Sample Admin User (Password: Admin@123 hash)
-- Note: You should use BCrypt to generate proper password hashes
INSERT INTO Users (Name, Email, PasswordHash, Role, CreatedAt) 
VALUES ('Admin User', 'admin@auction.com', '$2a$11$PLACEHOLDER', 'Admin', GETDATE());

-- Insert Sample Products
INSERT INTO Products (Name, Description, ActualPrice, StartingPrice, ImageUrl, CreatedAt)
VALUES 
    (N'Vintage Camera', N'A pristine vintage film camera from the 1970s', 450.00, 200.00, NULL, GETDATE()),
    (N'Gold Watch', N'18kt gold vintage Swiss watch', 2500.00, 1000.00, NULL, GETDATE()),
    (N'Rare Book', N'First edition collectible book from 1950', 800.00, 300.00, NULL, GETDATE()),
    (N'Antique Vase', N'Ming dynasty ceramic vase', 1500.00, 600.00, NULL, GETDATE()),
    (N'Gaming Laptop', N'High-performance laptop for gaming and development', 1800.00, 900.00, NULL, GETDATE());

-- Sample Query: Get all active auctions with product details
-- SELECT a.AuctionId, p.Name, p.StartingPrice, a.StartTime, a.EndTime, a.Status
-- FROM Auctions a
-- INNER JOIN Products p ON a.ProductId = p.ProductId
-- WHERE a.Status = 'Active' AND a.EndTime > GETDATE();

-- Sample Query: Get highest bid for an auction
-- SELECT TOP 1 b.BidId, b.BidAmount, u.Name AS BidderName, b.BidTime
-- FROM Bids b
-- INNER JOIN Users u ON b.UserId = u.UserId
-- WHERE b.AuctionId = 1
-- ORDER BY b.BidAmount DESC, b.BidTime ASC;
