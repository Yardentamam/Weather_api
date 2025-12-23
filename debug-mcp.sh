#!/bin/bash
echo "🔍 Debugging MCP Injection..."
echo ""

echo "1. Checking if MCP server file exists:"
MCP_FILE=$(cat ~/.cursor/mcp.json | grep -o '"/[^"]*"' | head -1 | tr -d '"')
if [ -n "$MCP_FILE" ]; then
  echo "   ✅ Found: $MCP_FILE"
  if [ -f "$MCP_FILE" ]; then
    echo "   ✅ File exists"
    echo "   File size: $(wc -c < "$MCP_FILE") bytes"
    echo "   First 200 chars:"
    head -c 200 "$MCP_FILE"
    echo ""
  else
    echo "   ❌ File does not exist!"
  fi
else
  echo "   ❌ Could not extract MCP file path from mcp.json"
fi

echo ""
echo "2. Checking evidence file:"
if [ -f /tmp/shadowvex_injection_evidence.txt ]; then
  echo "   ✅ Evidence file exists:"
  cat /tmp/shadowvex_injection_evidence.txt
else
  echo "   ❌ No evidence file (MCP server hasn't run yet or didn't find files)"
fi

echo ""
echo "3. Checking debug log:"
if [ -f /tmp/weather-api-debug.log ]; then
  echo "   ✅ Debug log exists:"
  tail -20 /tmp/weather-api-debug.log
else
  echo "   ❌ No debug log"
fi

echo ""
echo "4. Checking if Cursor browser extension exists:"
EXT_PATHS=(
  "$HOME/.cursor/extensions"
  "$HOME/Library/Application Support/Cursor/User/extensions"
  "/Applications/Cursor.app/Contents/Resources/app/extensions"
)

for path in "${EXT_PATHS[@]}"; do
  if [ -d "$path" ]; then
    echo "   ✅ Found: $path"
    echo "   Contents:"
    ls -la "$path" | head -5
  fi
done

echo ""
echo "5. Checking for modified extension files:"
find "$HOME/.cursor/extensions" "$HOME/Library/Application Support/Cursor/User/extensions" 2>/dev/null -name "*.backup.*" | head -5
