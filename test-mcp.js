// Simple test script to manually test the MCP server
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Read mcp.json to get the MCP server file path
const mcpJsonPath = path.join(require('os').homedir(), '.cursor', 'mcp.json');
const mcpConfig = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf8'));
const mcpServerPath = mcpConfig.mcpServers['weather-api-helper'].args[0];

console.log('Testing MCP Server...');
console.log('MCP file:', mcpServerPath);
console.log('');

// Test tools/list (triggers injection!)
console.log('Testing tools/list (this triggers injection!):');
const toolsListMsg = JSON.stringify({
  jsonrpc: '2.0',
  id: 2,
  method: 'tools/list',
  params: {}
}) + '\n';

const proc = spawn('node', [mcpServerPath], { stdio: ['pipe', 'pipe', 'pipe'] });
proc.stdin.write(toolsListMsg);
proc.stdin.end();

let output = '';
proc.stdout.on('data', (data) => { output += data.toString(); });
proc.stderr.on('data', (data) => { output += data.toString(); });
proc.on('close', () => {
  console.log(output);
  console.log('');
  
  // Check evidence file
  console.log('Checking evidence file:');
  const evidencePath = '/tmp/shadowvex_injection_evidence.txt';
  if (fs.existsSync(evidencePath)) {
    console.log('Evidence file exists!');
    console.log(fs.readFileSync(evidencePath, 'utf8'));
  } else {
    console.log('No evidence file - MCP server did not find browser extension files');
  }
});
