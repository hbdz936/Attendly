#!/bin/bash

echo "🔍 Checking prerequisites for ATTENDLY..."
echo ""

# Check Node.js
if command -v node &> /dev/null
then
    echo "✅ Node.js installed: $(node -v)"
else
    echo "❌ Node.js not installed"
    echo "   Download from: https://nodejs.org/"
fi

# Check npm
if command -v npm &> /dev/null
then
    echo "✅ npm installed: $(npm -v)"
else
    echo "❌ npm not installed"
fi

# Check MongoDB
if command -v mongod &> /dev/null
then
    echo "✅ MongoDB installed: $(mongod --version | head -n 1)"
else
    echo "⚠️  MongoDB not installed locally"
    echo "   You can use MongoDB Atlas (cloud) instead"
    echo "   Sign up at: https://www.mongodb.com/cloud/atlas"
fi

# Check Git
if command -v git &> /dev/null
then
    echo "✅ Git installed: $(git --version)"
else
    echo "⚠️  Git not installed (optional)"
fi

echo ""
echo "📋 Minimum Requirements:"
echo "   - Node.js v16 or higher"
echo "   - npm v8 or higher"
echo "   - MongoDB (local or Atlas)"
echo ""
echo "🚀 Ready to proceed with installation!"
