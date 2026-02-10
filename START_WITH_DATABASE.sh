#!/bin/bash

# AI Success Metrics Dashboard - Start with Database
# This script starts both the backend server and frontend

echo "🚀 Starting AI Success Metrics Dashboard with Database"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if server dependencies are installed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server
    npm install
    cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Initialize database if it doesn't exist
if [ ! -f "server/database/ai-metrics.db" ]; then
    echo "🗄️  Initializing database..."
    cd server
    npm run init-db
    cd ..
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Starting servers..."
echo "- Backend API: http://localhost:3001"
echo "- Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend server in background
cd server
npm start &
SERVER_PID=$!
cd ..

# Wait for server to start
sleep 3

# Start frontend
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $SERVER_PID $FRONTEND_PID
