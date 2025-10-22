#!/bin/bash

echo "🚀 Starting Financer Deployment..."
echo ""

# Step 1: Build Frontend
echo "📦 Step 1/3: Building frontend..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend dependencies installation failed!"
    exit 1
fi

npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi
echo "✅ Frontend built successfully!"
echo ""

# Step 2: Install Backend Dependencies
echo "📦 Step 2/3: Installing backend dependencies..."
cd ../server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend dependencies installation failed!"
    exit 1
fi
echo "✅ Backend dependencies installed!"
echo ""

# Step 3: Start Server
echo "🚀 Step 3/3: Starting server..."
echo ""
echo "✅ Deployment complete!"
echo "🌐 Server will start on http://localhost:5000"
echo "📝 Make sure your .env file is configured correctly"
echo ""

npm start
