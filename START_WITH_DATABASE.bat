@echo off
REM AI Success Metrics Dashboard - Start with Database (Windows)
REM This script starts both the backend server and frontend

echo.
echo Starting AI Success Metrics Dashboard with Database
echo ==================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if server dependencies are installed
if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    call npm install
    cd ..
)

REM Check if frontend dependencies are installed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Initialize database if it doesn't exist
if not exist "server\database\ai-metrics.db" (
    echo Initializing database...
    cd server
    call npm run init-db
    cd ..
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
)

echo.
echo Setup complete!
echo.
echo Starting servers...
echo - Backend API: http://localhost:3001
echo - Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop the servers
echo.

REM Start backend server
start "Backend Server" cmd /k "cd server && npm start"

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

REM Start frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting in separate windows...
echo.
pause
