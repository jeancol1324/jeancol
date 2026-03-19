@echo off
title JEANCOL - E-Commerce App
color 0A
echo.
echo ========================================
echo    JEANCOL - Starting Application
echo ========================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo [1/2] Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo [2/2] Starting development server...
echo.
echo Opening: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
