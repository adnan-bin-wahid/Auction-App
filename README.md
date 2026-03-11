# Auction-App

Monorepo for the Auction application backend and frontend.

## Repository structure

- `backend/Auction.API/Auction.API` - ASP.NET Core Web API
- `frontend/auction-client` - Angular client

## Prerequisites

Install these before running the app locally:

- Git
- .NET 10 SDK
- Node.js with npm
- SQL Server or SQL Server Express

## Run the app locally from GitHub

### 1. Clone the repository

```bash
git clone https://github.com/adnan-bin-wahid/Auction-App.git
cd Auction-App
```

### 2. Configure the database connection

Open `backend/Auction.API/Auction.API/appsettings.json` and update `ConnectionStrings:DefaultConnection` so it matches your local SQL Server instance.

Example:

```json
"ConnectionStrings": {
	"DefaultConnection": "Server=YOUR_SERVER_NAME;Database=AuctionDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

If your machine does not have a SQL Server instance named `ADNAN\\SQLEXPRESS`, this step is required.

### 3. Start the backend API

Open a terminal in the repository root and run:

```bash
cd backend/Auction.API/Auction.API
dotnet restore
dotnet dev-certs https --trust
dotnet run --launch-profile https
```

When the API starts, it should be available at:

- `https://localhost:7170`
- Swagger UI: `https://localhost:7170/swagger`

Keep this terminal running.

### 4. Start the Angular frontend

Open a second terminal in the repository root and run:

```bash
cd frontend/auction-client
npm install
npm start
```

The Angular app will run at:

- `http://localhost:4200`

Keep this terminal running too.

### 5. Open the application

Open this URL in your browser:

```text
http://localhost:4200
```

The frontend is configured to send `/api` requests to the backend running on `https://localhost:7170`.

## Daily workflow after the first setup

Backend:

```bash
cd backend/Auction.API/Auction.API
dotnet run --launch-profile https
```

Frontend:

```bash
cd frontend/auction-client
npm start
```

## Troubleshooting

### HTTPS certificate warning

If the backend HTTPS certificate is not trusted, run:

```bash
dotnet dev-certs https --trust
```

### Database connection error

If the API fails to start because of SQL Server, re-check the connection string in `backend/Auction.API/Auction.API/appsettings.json` and make sure your SQL Server service is running.

### Frontend cannot reach the API

Make sure the backend is running with the `https` launch profile so it listens on `https://localhost:7170`.