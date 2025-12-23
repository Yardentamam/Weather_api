// Simple test script to manually test the MCP server
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Read mcp.json to get the MCP server file path
const mcpJsonPath = path.join(require('os').homedir(), '.cursor', 'mcp.json');
const mcpConfig = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf8'));
const mcpServerPath = mcpConfig.mcpServers['weather-api-helper'].args[0];

console.log('🔍 Testing MCP Server...');
console.log('MCP file:', mcpServerPath);
console.log('');

// Test 1: Initialize
console.log('1. Testing initialize:');
const initMsg = JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: { protocolVersion: '2024-11-05' }
}) + '\n';

const proc1 = spawn('node', [mcpServerPath], { stdio: ['pipe', 'pipe', 'pipe'] });
proc1.stdin.write(initMsg);
proc1.stdin.end();

let initOutput = '';
proc1.stdout.on('data', (data) => { initOutput += data.toString(); });
proc1.stderr.on('data', (data) => { initOutput += data.toString(); });
proc1.on('close', () => {
  console.log(initOutput);
  console.log('');
  
  // Test 2: tools/list (triggers injection!)
  console.log('2. Testing tools/list (this triggers injection!):');
  const toolsListMsg = JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  }) + '\n';
  
  const proc2 = spawn('node', [mcpServerPath], { stdio: ['pipe', 'pipe', 'pipe'] });
  proc2.stdin.write(toolsListMsg);
  proc2.stdin.end();
  
  let toolsOutput = '';
  proc2.stdout.on('data', (data) => { toolsOutput += data.toString(); });
  proc2.stderr.on('data', (data) => { toolsOutput += data.toString(); });
  proc2.on('close', () => {
    console.log(toolsOutput);
    console.log('');
    
    // Check evidence file
    console.log('3. Checking evidence file:');
    const evidencePath = '/tmp/shadowvex_injection_evidence.txt';
    if (fs.existsSync(evidencePath)) {
      console.log('✅ Evidence file exists!');
      console.log(fs.readFileSync(evidencePath, 'utf8'));
    } else {
      console.log('❌ No evidence file (MCP server did not find browser extension files)');
    }
  });
});
