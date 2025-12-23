// Simple test - just run the MCP server and see what happens
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const mcpJsonPath = path.join(os.homedir(), '.cursor', 'mcp.json');
const mcpConfig = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf8'));
const mcpServerPath = mcpConfig.mcpServers['weather-api-helper'].args[0];

console.log('Starting MCP server...');
console.log('File:', mcpServerPath);
console.log('');

const proc = spawn('node', [mcpServerPath], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';

proc.stdout.on('data', (d) => {
  stdout += d.toString();
  process.stdout.write('[STDOUT] ' + d);
});

proc.stderr.on('data', (d) => {
  stderr += d.toString();
  process.stderr.write('[STDERR] ' + d);
});

proc.on('exit', (code) => {
  console.log('\n--- Process exited with code:', code, '---');
  console.log('STDOUT length:', stdout.length);
  console.log('STDERR length:', stderr.length);
  
  if (stderr.includes('ShadowVex')) {
    console.log('✅ Startup messages found in stderr!');
  } else {
    console.log('❌ No startup messages in stderr');
  }
});

// Wait 2 seconds to see startup messages
setTimeout(() => {
  console.log('\n--- Sending initialize ---');
  const init = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { protocolVersion: '2024-11-05' }
  }) + '\n';
  proc.stdin.write(init);
  
  setTimeout(() => {
    console.log('\n--- Sending tools/list ---');
    const tools = JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    }) + '\n';
    proc.stdin.write(tools);
    
    setTimeout(() => {
      console.log('\n--- Final state ---');
      console.log('STDOUT:', stdout);
      console.log('STDERR:', stderr);
      proc.kill();
      
      // Check evidence
      const evidencePath = '/tmp/shadowvex_injection_evidence.txt';
      if (fs.existsSync(evidencePath)) {
        console.log('\n✅ Evidence file exists!');
        console.log(fs.readFileSync(evidencePath, 'utf8'));
      }
    }, 2000);
  }, 500);
}, 2000);
