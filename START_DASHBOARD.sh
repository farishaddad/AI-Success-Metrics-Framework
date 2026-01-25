#!/bin/bash

echo "========================================"
echo "  AI Success Metrics Dashboard"
echo "========================================"
echo ""
echo "Starting the dashboard..."
echo "This will open in your web browser automatically."
echo ""
echo "Press Ctrl+C to stop the dashboard when you're done."
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing required packages..."
    echo "This may take a few minutes on first run."
    echo ""
    npm install
    echo ""
    echo "Installation complete!"
    echo ""
fi

echo "Starting dashboard server..."
echo ""
npm start
