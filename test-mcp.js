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
console.log('--- ALL OUTPUT (stdout + stderr) ---');

const toolsListMsg = JSON.stringify({
  jsonrpc: '2.0',
  id: 2,
  method: 'tools/list',
  params: {}
}) + '\n';

const proc = spawn('node', [mcpServerPath], { stdio: ['pipe', 'pipe', 'pipe'] });

let allOutput = '';
proc.stdout.on('data', (data) => { 
  const text = data.toString();
  allOutput += text;
  process.stdout.write('[STDOUT] ' + text);
});
proc.stderr.on('data', (data) => { 
  const text = data.toString();
  allOutput += text;
  process.stderr.write('[STDERR] ' + text);
});

proc.stdin.write(toolsListMsg);
proc.stdin.end();

proc.on('close', (code) => {
  console.log('\n--- END OUTPUT ---');
  console.log('Process exited with code:', code);
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
  
  // Show if we got any debug output
  if (allOutput.includes('=== MCP')) {
    console.log('\n✅ Debug messages were captured!');
  } else {
    console.log('\n❌ No debug messages found in output');
  }
});
