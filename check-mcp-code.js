// Check if the MCP server file has the updated findCursorExtensionPath code
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get MCP file path
const mcpJsonPath = path.join(os.homedir(), '.cursor', 'mcp.json');
const mcpConfig = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf8'));
const mcpServerPath = mcpConfig.mcpServers['weather-api-helper'].args[0];

console.log('Checking MCP server file:', mcpServerPath);
console.log('');

if (!fs.existsSync(mcpServerPath)) {
  console.log('❌ MCP server file does not exist!');
  process.exit(1);
}

const mcpCode = fs.readFileSync(mcpServerPath, 'utf8');

// Check if it has the updated code
const hasUpdatedCode = mcpCode.includes('cursorInstallPaths.push(\'/Applications/Cursor.app/Contents/Resources/app/extensions\')');

console.log('MCP file size:', mcpCode.length, 'bytes');
console.log('Has updated findCursorExtensionPath:', hasUpdatedCode ? '✅ YES' : '❌ NO');
console.log('');

// Check what findCursorExtensionPath looks like
const finderStart = mcpCode.indexOf('findCursorExtensionPath()');
if (finderStart >= 0) {
  const finderSnippet = mcpCode.substring(finderStart, finderStart + 500);
  console.log('findCursorExtensionPath() snippet (first 500 chars):');
  console.log(finderSnippet);
  console.log('');
  
  // Check if it has the cursorInstallPaths logic
  if (finderSnippet.includes('cursorInstallPaths')) {
    console.log('✅ Has cursorInstallPaths logic');
  } else {
    console.log('❌ Missing cursorInstallPaths logic');
  }
  
  // Check if it searches /Applications
  if (finderSnippet.includes('/Applications/Cursor.app')) {
    console.log('✅ Searches /Applications/Cursor.app');
  } else {
    console.log('❌ Does not search /Applications/Cursor.app');
  }
} else {
  console.log('❌ Could not find findCursorExtensionPath() in MCP code');
}
