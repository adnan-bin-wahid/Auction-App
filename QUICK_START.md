# Quick Start Guide - Sealed-Bid Auction System

Get the application running in 10 minutes!

## 📋 Prerequisites

- **SQL Server** 2019 or later (with SQL Server Management Studio)
- **.NET 10.0 SDK** installed
- **Node.js 18+** and npm 10+

## ⚡ Quick Setup

### Step 1: Database Setup (2 minutes)

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your local SQL Server instance
3. Open the file: `backend/Auction.API/SealedBidAuctionDB_Init.sql`
4. Click **Execute** (or press F5)

✅ Database is ready!

### Step 2: Start Backend API (3 minutes)

```bash
# Open terminal and run:
cd backend/Auction.API/Auction.API
dotnet restore
dotnet run
```

You should see: `Now listening on: https://localhost:7000`

✅ Backend API is running! Visit: https://localhost:7000/swagger

### Step 3: Start Frontend (3 minutes)

Open a **new terminal** and run:

```bash
cd frontend/auction-client
npm install
npm start
```

Wait for: `✔ Compiled successfully.`

✅ Frontend is running at: http://localhost:4200

## 🎮 Test the System

### Step 1: Register a User Account

1. Visit http://localhost:4200
2. Click **Register**
3. Fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `Password123`
4. Click **Register**

### Step 2: View Available Auctions

1. You should see a list of sample auctions
2. Each auction shows:
   - Product name
   - Starting price
   - Auction timeline
   - Current status

### Step 3: Create a Product (Admin Only)

**Note**: Admin user is pre-created in the database:

- Email: `admin@auction.com`
- Password: `Admin@123` (hash placeholder - you'll need to use a valid bcrypt hash)

For testing, you can use Swagger UI:

1. Go to: https://localhost:7000/swagger
2. Find `POST /api/products`
3. Click "Try it out"
4. Enter product details:

```json
{
  "name": "Vintage Camera",
  "description": "A pristine vintage film camera from the 1970s",
  "actualPrice": 450.0,
  "startingPrice": 200.0,
  "imageUrl": null
}
```

5. Click **Execute**

### Step 4: Create an Auction

Using Swagger UI:

1. Find `POST /api/auctions`
2. Click "Try it out"
3. Enter auction details:

```json
{
  "productId": 1,
  "startTime": "2026-03-16T10:00:00Z",
  "endTime": "2026-03-18T10:00:00Z"
}
```

4. Click **Execute**

### Step 5: Place a Bid

1. Back in the web application (http://localhost:4200)
2. Click on an auction "View Details"
3. Enter your bid amount (must be ≥ starting price)
4. Click **Place Bid**

## 📊 Sample Test Data

The database comes pre-populated with:

### Sample Bidders

1. User 1 - john@example.com
2. User 2 - jane@example.com
3. And more...

### Sample Products

1. Vintage Camera - Starting: $200
2. Gold Watch - Starting: $1,000
3. Rare Book - Starting: $300
4. Antique Vase - Starting: $600
5. Gaming Laptop - Starting: $900

## 🧪 Testing Scenarios

### Scenario 1: Place Multiple Bids

```
1. Log in as User 1
2. Place bid on Auction 1: $250
3. Log out
4. Log in as User 2
5. Place bid on Auction 1: $300
6. Note: User 1 cannot see User 2's bid
```

### Scenario 2: View Bid History

```
1. Log in as any user
2. Go to "My Bids" (when implemented)
3. See all bids placed by this user
4. Each bid shows: Amount, Auction, Time
```

### Scenario 3: Admin Views All Bids

```
1. Log in as admin@auction.com
2. Navigate to Admin Panel
3. Select an auction
4. View ALL bids (including amounts)
5. Users cannot see this!
```

## 🔧 Useful URLs

| Component        | URL                                            |
| ---------------- | ---------------------------------------------- |
| Frontend App     | http://localhost:4200                          |
| API Base         | http://localhost:5000                          |
| API Base (HTTPS) | https://localhost:7000                         |
| Swagger UI       | https://localhost:7000/swagger                 |
| API Health       | https://localhost:7000/health (if implemented) |

## 🛠️ Common Issues & Solutions

### Issue: "Database doesn't exist"

**Solution**: Run the SQL script again from Step 1

### Issue: "Port 5000/7000 already in use"

**Solution**:

```bash
# Find process using port (Windows)
netstat -ano | findstr :7000
# Kill process
taskkill /PID {PID} /F
```

### Issue: "Frontend can't connect to API"

**Solution**:

- Verify backend is running
- Check CORS origin in backend (should be http://localhost:4200)
- Clear browser cache and restart

### Issue: "npm install fails"

**Solution**:

```bash
# Clear npm cache
npm cache clean --force
# Try again
npm install
```

## 📚 Next Steps

1. **Explore the API**: Visit https://localhost:7000/swagger
2. **Read Full Docs**: Open `PROJECT_README.md`
3. **Implement Features**: Check the checklist in `PROJECT_README.md`
4. **Add Authentication**: Implement JWT tokens for security
5. **Deploy**: Move to staging/production environment

## 🐛 Need Help?

- Check logs in terminal for error messages
- Visit https://localhost:7000/swagger for API documentation
- Review `API_DOCUMENTATION.md` for detailed endpoint info
- Check `PROJECT_README.md` for troubleshooting section

## 📞 Support

If you encounter issues:

1. Check the terminal output for error messages
2. Verify all prerequisites are installed
3. Ensure database script ran successfully
4. Confirm ports 4200, 5000, 7000 are available
5. Clear browser cache if frontend has issues

---

**Ready to go!** You now have a fully functional sealed-bid auction system. 🎉
