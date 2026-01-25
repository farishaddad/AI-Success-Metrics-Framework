@echo off
echo ========================================
echo   AI Success Metrics Dashboard
echo ========================================
echo.
echo Starting the dashboard...
echo This will open in your web browser automatically.
echo.
echo Press Ctrl+C to stop the dashboard when you're done.
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing required packages...
    echo This may take a few minutes on first run.
    echo.
    call npm install
    echo.
    echo Installation complete!
    echo.
)

echo Starting dashboard server...
echo.
call npm start

pause
