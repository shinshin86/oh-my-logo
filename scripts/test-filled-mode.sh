#!/bin/bash

# Test script for filled mode terminal corruption issue (#16)
# This script runs oh-my-logo multiple times with different fonts and colors
# to verify that terminal state is properly reset after each execution

echo "Starting filled mode stress test..."
echo "This test will run oh-my-logo with all available fonts multiple times"
echo "Watch for any terminal corruption or display issues"
echo ""

# Build the project first
echo "Building project..."
npm run build

echo ""
echo "=== Starting test iterations ==="
echo ""

# List of all available fonts
FONTS=(block chrome grid huge pallet shade simple simple3d simpleBlock slick tiny)
PALETTES=(grad-blue sunset dawn nebula mono ocean fire forest gold purple mint coral matrix)

# Run multiple iterations
for iteration in {1..5}; do
  echo "--- Iteration $iteration of 5 ---"
  
  # Test each font
  for font in "${FONTS[@]}"; do
    # Pick a random palette for variety
    palette=${PALETTES[$RANDOM % ${#PALETTES[@]}]}
    
    echo "Testing font: $font with palette: $palette"
    node dist/index.js "TEST" "$palette" --filled --block-font "$font"
    
    # Small delay to allow terminal to process
    sleep 0.1
  done
  
  echo ""
done

echo "=== Test completed ==="
echo ""
echo "Verification checks:"
echo "1. Normal ASCII text: ABCDEFGHIJKLMNOPQRSTUVWXYZ"
echo "2. Numbers: 0123456789"
echo "3. Special characters: !@#$%^&*()"
echo "4. Unicode test: ✓ ✗ ★ ☆ ♥ ♦ ♣ ♠"
echo "5. Japanese text: これは正常に表示されていますか？"
echo "6. Box drawing: ┌─┬─┐ │ │ │ ├─┼─┤ │ │ │ └─┴─┘"
echo ""
echo "If all the above text displays correctly, the terminal cleanup is working properly."
echo "If you see corrupted characters, the issue persists."