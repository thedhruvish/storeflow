#!/usr/bin/env bash

set -e

NODE_DOWNLOAD_URL="https://nodejs.org/en/download"
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:4000" 

# ------------------ Check Node.js ------------------
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is not installed."
  echo "👉 Please install it from:"
  echo "   ${NODE_DOWNLOAD_URL}"
  exit 1
fi

# ------------------ Check npm ------------------
if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm is not installed."
  echo "👉 Please install Node.js (npm is bundled):"
  echo "   ${NODE_DOWNLOAD_URL}"
  exit 1
fi

echo "✅ Node.js: $(node -v)"
echo "✅ npm: $(npm -v)"

# ------------------ Frontend ------------------
echo "🚀 Starting Frontend..."
cd frontend
npm install
# npm run build
npm run dev &

FRONTEND_PID=$!
cd ..

# ------------------ Backend ------------------
echo "🚀 Starting Backend..."
cd backend
npm install
npm run start &

BACKEND_PID=$!
cd ..

# ------------------ Wait for BOTH ------------------
echo "⏳ Waiting for frontend and backend to be ready..."

until curl -s "$FRONTEND_URL" >/dev/null 2>&1 && \
      curl -s "$BACKEND_URL" >/dev/null 2>&1; do
  sleep 1
done

# ------------------ Open Browser ------------------
echo "🌍 Opening browser at $FRONTEND_URL"

if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$FRONTEND_URL"        # Linux
elif command -v open >/dev/null 2>&1; then
  open "$FRONTEND_URL"            # macOS
elif command -v cmd.exe >/dev/null 2>&1; then
  cmd.exe /c start "$FRONTEND_URL" # Windows (WSL / Git Bash)
else
  echo "⚠️ Unable to auto-open browser. Please open $FRONTEND_URL manually."
fi

echo "✅ Frontend & Backend are running"
echo "🛑 Press Ctrl+C to stop all services"

wait