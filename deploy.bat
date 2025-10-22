@echo off
echo 🚀 Starting Financer Deployment...
echo.

REM Step 1: Build Frontend
echo 📦 Step 1/3: Building frontend...
cd client
call npm install
if errorlevel 1 (
    echo ❌ Frontend dependencies installation failed!
    exit /b 1
)

call npm run build
if errorlevel 1 (
    echo ❌ Frontend build failed!
    exit /b 1
)
echo ✅ Frontend built successfully!
echo.

REM Step 2: Install Backend Dependencies
echo 📦 Step 2/3: Installing backend dependencies...
cd ..\server
call npm install
if errorlevel 1 (
    echo ❌ Backend dependencies installation failed!
    exit /b 1
)
echo ✅ Backend dependencies installed!
echo.

REM Step 3: Start Server
echo 🚀 Step 3/3: Starting server...
echo.
echo ✅ Deployment complete!
echo 🌐 Server will start on http://localhost:5000
echo 📝 Make sure your .env file is configured correctly
echo.

call npm start
