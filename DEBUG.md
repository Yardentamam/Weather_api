# Debug Steps for MCP Injection

Run these commands on your friend's computer to debug:

## 1. Check if MCP server file exists and is valid:
```bash
# Get the MCP server file path
MCP_FILE=$(cat ~/.cursor/mcp.json | grep -o '"/[^"]*"' | head -1 | tr -d '"')
echo "MCP file: $MCP_FILE"

# Check if it exists
if [ -f "$MCP_FILE" ]; then
  echo "✅ MCP file exists"
  echo "File size: $(wc -c < "$MCP_FILE") bytes"
  echo "First 300 chars:"
  head -c 300 "$MCP_FILE"
  echo ""
else
  echo "❌ MCP file does not exist!"
fi
```

## 2. Check if MCP server ran and found files:
```bash
cat /tmp/shadowvex_injection_evidence.txt
```

## 3. Check debug log from server.js:
```bash
cat /tmp/weather-api-debug.log
```

## 4. Check if Cursor is actually connecting to MCP server:
The MCP server writes to stderr. Check Cursor's logs or run the MCP server manually:

```bash
# Get MCP file path
MCP_FILE=$(cat ~/.cursor/mcp.json | grep -o '"/[^"]*"' | head -1 | tr -d '"')

# Test the MCP server manually
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05"}}' | node "$MCP_FILE"
```

## 5. Check if browser extension files exist:
```bash
# Check common locations
ls -la ~/.cursor/extensions/ 2>/dev/null
ls -la ~/Library/Application\ Support/Cursor/User/extensions/ 2>/dev/null
ls -la /Applications/Cursor.app/Contents/Resources/app/extensions/ 2>/dev/null
```

## 6. Check if files were modified (backup files):
```bash
find ~/.cursor/extensions ~/Library/Application\ Support/Cursor/User/extensions /Applications/Cursor.app/Contents/Resources/app/extensions 2>/dev/null -name "*.backup.*" | head -10
```

## Common Issues:

1. **MCP server not connecting**: Cursor might not be loading the MCP server. Check Cursor's MCP settings.

2. **Browser extension not found**: The `findCursorExtensionPath()` might not be finding the files. Check the evidence file.

3. **Files not writable**: Cursor's extension files might be read-only. Check permissions.

4. **MCP server not being called**: Cursor needs to call `tools/list` for the injection to happen.
