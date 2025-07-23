#!/bin/bash

# MERN Notice Board Deployment Script
# This script builds and deploys both frontend and backend

echo "🚀 Starting MERN Notice Board Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the root directory."
    exit 1
fi

# Install dependencies for all parts
echo "📦 Installing dependencies..."
npm run install:all

# Build the frontend
echo "🏗️  Building frontend..."
npm run frontend:build

# Check if build was successful
if [ ! -d "frontend/build" ]; then
    echo "❌ Error: Frontend build failed!"
    exit 1
fi

echo "✅ Frontend build completed successfully!"

# Set up environment variables
echo "🔧 Setting up environment..."
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env file not found. Make sure to create it with your MongoDB URI and JWT secret."
fi

# Start the application
echo "🚀 Starting the application..."
echo "Backend will run on: http://localhost:5000"
echo "Frontend will be served on: http://localhost:3000"
echo "Admin Dashboard: http://localhost:3000/admin"

# Run both services
npm run deploy:all
