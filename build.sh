#!/bin/bash

# Build script for TLCSDM Quick Access Plugin
# This script creates distribution packages for Chrome and Edge browsers

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$SCRIPT_DIR/src"
DIST_DIR="$SCRIPT_DIR/dist"
ICONS_DIR="$SCRIPT_DIR/icons"

# Clean dist directory
echo "Cleaning dist directory..."
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR/chrome" "$DIST_DIR/edge"

# Build Chrome extension
echo "Building Chrome extension..."
cp "$SRC_DIR/chrome/manifest.json" "$DIST_DIR/chrome/"
cp "$SRC_DIR/shared/popup.html" "$DIST_DIR/chrome/"
cp "$SRC_DIR/shared/popup.css" "$DIST_DIR/chrome/"
cp "$SRC_DIR/shared/popup.js" "$DIST_DIR/chrome/"
mkdir -p "$DIST_DIR/chrome/icons"
cp "$ICONS_DIR"/*.png "$DIST_DIR/chrome/icons/" 2>/dev/null || echo "Note: PNG icons not found. Please generate icons from icon.svg"

# Build Edge extension
echo "Building Edge extension..."
cp "$SRC_DIR/edge/manifest.json" "$DIST_DIR/edge/"
cp "$SRC_DIR/shared/popup.html" "$DIST_DIR/edge/"
cp "$SRC_DIR/shared/popup.css" "$DIST_DIR/edge/"
cp "$SRC_DIR/shared/popup.js" "$DIST_DIR/edge/"
mkdir -p "$DIST_DIR/edge/icons"
cp "$ICONS_DIR"/*.png "$DIST_DIR/edge/icons/" 2>/dev/null || echo "Note: PNG icons not found. Please generate icons from icon.svg"

# Create ZIP packages for distribution
echo "Creating ZIP packages..."
cd "$DIST_DIR/chrome" && zip -r "../tlcsdm-quick-access-chrome.zip" . 
cd "$DIST_DIR/edge" && zip -r "../tlcsdm-quick-access-edge.zip" .

echo ""
echo "Build complete!"
echo "Chrome extension: $DIST_DIR/tlcsdm-quick-access-chrome.zip"
echo "Edge extension: $DIST_DIR/tlcsdm-quick-access-edge.zip"
echo ""
echo "To install for development:"
echo "  Chrome: Go to chrome://extensions, enable Developer mode, click 'Load unpacked', select $DIST_DIR/chrome"
echo "  Edge: Go to edge://extensions, enable Developer mode, click 'Load unpacked', select $DIST_DIR/edge"
