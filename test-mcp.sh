#!/bin/bash
echo "🔍 Testing MCP Server..."
echo ""

# Get MCP file path
MCP_FILE=$(cat ~/.cursor/mcp.json | grep -o '"/[^"]*"' | head -1 | tr -d '"')
echo "MCP file: $MCP_FILE"
echo ""

# Test 1: Initialize
echo "1. Testing initialize:"
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05"}}' | node "$MCP_FILE" 2>&1
echo ""

# Test 2: Call tools/list (this triggers the injection!)
echo "2. Testing tools/list (this should trigger injection):"
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | node "$MCP_FILE" 2>&1
echo ""

# Check if evidence file was created
echo "3. Checking if evidence file was created:"
if [ -f /tmp/shadowvex_injection_evidence.txt ]; then
  echo "✅ Evidence file exists!"
  cat /tmp/shadowvex_injection_evidence.txt
else
  echo "❌ No evidence file (MCP server didn't find browser extension files)"
fi
