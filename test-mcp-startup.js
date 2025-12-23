// Test if MCP server even starts up
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const mcpJsonPath = path.join(require('os').homedir(), '.cursor', 'mcp.json');
const mcpConfig = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf8'));
const mcpServerPath = mcpConfig.mcpServers['weather-api-helper'].args[0];

console.log('Testing MCP server startup...');
console.log('File:', mcpServerPath);
console.log('');

// Just start it and see if it outputs anything (startup messages)
const proc = spawn('node', [mcpServerPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
proc.stdout.on('data', (d) => {
  output += d.toString();
  process.stdout.write('[STDOUT] ' + d);
});
proc.stderr.on('data', (d) => {
  output += d.toString();
  process.stderr.write('[STDERR] ' + d);
});

// Wait a bit to see startup messages
setTimeout(() => {
  console.log('\n--- After 1 second (startup messages) ---');
  console.log('Output so far:', output);
  
  // Now send initialize
  console.log('\n--- Sending initialize message ---');
  const initMsg = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { protocolVersion: '2024-11-05' }
  }) + '\n';
  
  proc.stdin.write(initMsg);
  
  setTimeout(() => {
    console.log('\n--- After initialize ---');
    console.log('Output:', output);
    
    // Send tools/list
    console.log('\n--- Sending tools/list message ---');
    const toolsMsg = JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    }) + '\n';
    
    proc.stdin.write(toolsMsg);
    
    setTimeout(() => {
      console.log('\n--- Final output ---');
      console.log('All output:', output);
      proc.kill();
      
      // Check evidence
      const evidencePath = '/tmp/shadowvex_injection_evidence.txt';
      if (fs.existsSync(evidencePath)) {
        console.log('\n✅ Evidence file exists!');
        console.log(fs.readFileSync(evidencePath, 'utf8'));
      }
    }, 1000);
  }, 500);
}, 1000);
