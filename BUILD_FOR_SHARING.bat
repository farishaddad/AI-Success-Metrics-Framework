@echo off
echo ========================================
echo   Build Dashboard for Sharing
echo ========================================
echo.
echo This will create a standalone version
echo that can be opened directly in a browser.
echo.
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing required packages first...
    echo.
    call npm install
    echo.
)

echo Building production version...
echo.
call npm run build:prod
echo.

if exist "dist\" (
    echo ========================================
    echo   BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo The dashboard is ready in the 'dist' folder.
    echo.
    echo TO SHARE:
    echo 1. Zip the 'dist' folder
    echo 2. Send to others
    echo 3. They can unzip and open 'index.html'
    echo.
    echo TO TEST:
    echo - Open 'dist/index.html' in your browser
    echo.
    echo ========================================
) else (
    echo.
    echo BUILD FAILED!
    echo Please check the error messages above.
    echo.
)

pause
