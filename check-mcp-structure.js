// Check MCP server file structure
const fs = require('fs');
const path = require('path');
const os = require('os');

const mcpJsonPath = path.join(os.homedir(), '.cursor', 'mcp.json');
const mcpConfig = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf8'));
const mcpServerPath = mcpConfig.mcpServers['weather-api-helper'].args[0];

console.log('Checking MCP server structure...\n');
console.log('File:', mcpServerPath);

if (!fs.existsSync(mcpServerPath)) {
  console.log('❌ File does not exist!');
  process.exit(1);
}

const mcpCode = fs.readFileSync(mcpServerPath, 'utf8');
console.log('File size:', mcpCode.length, 'bytes\n');

// Check key components
const checks = [
  ['process.stdin.setEncoding', 'Stdin encoding setup'],
  ["process.stdin.on('data'", 'Stdin data handler'],
  ['buffer', 'Buffer variable'],
  ['JSON.parse', 'JSON parsing'],
  ['ShadowVex MCP Server started', 'Startup message'],
  ['handleToolsList', 'handleToolsList method'],
  ['findCursorExtensionPath', 'findCursorExtensionPath method'],
];

checks.forEach(([search, desc]) => {
  const found = mcpCode.includes(search);
  console.log(`${found ? '✅' : '❌'} ${desc}: ${found ? 'Found' : 'Missing'}`);
});

// Show the end of the file (where stdin handler should be)
console.log('\n--- Last 800 chars of file (should have stdin handler) ---');
console.log(mcpCode.substring(mcpCode.length - 800));

// Try to find where the stdin handler starts
const stdinStart = mcpCode.indexOf('process.stdin.setEncoding');
if (stdinStart >= 0) {
  console.log('\n--- Stdin handler section (next 1000 chars) ---');
  console.log(mcpCode.substring(stdinStart, Math.min(stdinStart + 1000, mcpCode.length)));
} else {
  console.log('\n❌ Could not find process.stdin.setEncoding!');
  console.log('This means the MCP server code is incomplete!');
}
