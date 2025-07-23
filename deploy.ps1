# MERN Notice Board Deployment Script for Windows PowerShell
# This script builds and deploys both frontend and backend

Write-Host "🚀 Starting MERN Notice Board Deployment..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the root directory." -ForegroundColor Red
    exit 1
}

# Install dependencies for all parts
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm run install:all

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to install dependencies!" -ForegroundColor Red
    exit 1
}

# Build the frontend
Write-Host "🏗️  Building frontend..." -ForegroundColor Yellow
npm run frontend:build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Frontend build failed!" -ForegroundColor Red
    exit 1
}

# Check if build was successful
if (-not (Test-Path "frontend/build")) {
    Write-Host "❌ Error: Frontend build directory not found!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend build completed successfully!" -ForegroundColor Green

# Set up environment variables
Write-Host "🔧 Setting up environment..." -ForegroundColor Yellow
if (-not (Test-Path "backend/.env")) {
    Write-Host "⚠️  Warning: backend/.env file not found. Make sure to create it with your MongoDB URI and JWT secret." -ForegroundColor Yellow
}

# Start the application
Write-Host "🚀 Starting the application..." -ForegroundColor Green
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will be served on: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Admin Dashboard: http://localhost:3000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the application" -ForegroundColor Yellow

# Run both services
npm run deploy:all
