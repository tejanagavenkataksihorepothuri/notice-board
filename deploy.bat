@echo off
echo 🚀 Starting MERN Notice Board Deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the root directory.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
call npm run install:all
if errorlevel 1 (
    echo ❌ Error: Failed to install dependencies!
    pause
    exit /b 1
)

echo 🏗️ Building frontend...
call npm run frontend:build
if errorlevel 1 (
    echo ❌ Error: Frontend build failed!
    pause
    exit /b 1
)

REM Check if build was successful
if not exist "frontend\build" (
    echo ❌ Error: Frontend build directory not found!
    pause
    exit /b 1
)

echo ✅ Frontend build completed successfully!

echo 🔧 Setting up environment...
if not exist "backend\.env" (
    echo ⚠️ Warning: backend\.env file not found. Make sure to create it with your MongoDB URI and JWT secret.
)

echo 🚀 Starting the application...
echo Backend will run on: http://localhost:5000
echo Frontend will be served on: http://localhost:3000
echo Admin Dashboard: http://localhost:3000/admin
echo.
echo Press Ctrl+C to stop the application

REM Run both services
call npm run deploy:all
