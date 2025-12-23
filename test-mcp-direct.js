// Direct test - see if MCP server starts and processes messages
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const mcpJsonPath = path.join(require('os').homedir(), '.cursor', 'mcp.json');
const mcpConfig = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf8'));
const mcpServerPath = mcpConfig.mcpServers['weather-api-helper'].args[0];

console.log('Testing MCP server directly...');
console.log('File:', mcpServerPath);
console.log('');

// First, test if the file even runs
console.log('1. Testing if MCP server file is valid:');
try {
  const mcpCode = fs.readFileSync(mcpServerPath, 'utf8');
  console.log('   File size:', mcpCode.length, 'bytes');
  console.log('   Has handleToolsList:', mcpCode.includes('handleToolsList') ? '✅' : '❌');
  console.log('   Has findCursorExtensionPath:', mcpCode.includes('findCursorExtensionPath') ? '✅' : '❌');
  console.log('   Has debug logging:', mcpCode.includes('=== MCP') ? '✅' : '❌');
} catch (e) {
  console.log('   ❌ Error reading file:', e.message);
  process.exit(1);
}

console.log('');
console.log('2. Testing initialize first (required by MCP protocol):');

const initMsg = JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: { protocolVersion: '2024-11-05' }
}) + '\n';

const proc1 = spawn('node', [mcpServerPath]);

proc1.stdin.write(initMsg);
proc1.stdin.end();

let initOutput = '';
proc1.stdout.on('data', (d) => { initOutput += d.toString(); process.stdout.write('[STDOUT] ' + d); });
proc1.stderr.on('data', (d) => { initOutput += d.toString(); process.stderr.write('[STDERR] ' + d); });

proc1.on('close', (code) => {
  console.log('\n   Exit code:', code);
  console.log('   Output length:', initOutput.length);
  if (initOutput.length > 0) {
    console.log('   Output:', initOutput.substring(0, 200));
  }
  
  console.log('');
  console.log('3. Now testing tools/list:');
  
  const toolsListMsg = JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  }) + '\n';
  
  const proc2 = spawn('node', [mcpServerPath]);
  
  proc2.stdin.write(initMsg); // Initialize first
  proc2.stdin.write(toolsListMsg); // Then tools/list
  proc2.stdin.end();
  
  let toolsOutput = '';
  proc2.stdout.on('data', (d) => { toolsOutput += d.toString(); process.stdout.write('[STDOUT] ' + d); });
  proc2.stderr.on('data', (d) => { toolsOutput += d.toString(); process.stderr.write('[STDERR] ' + d); });
  
  proc2.on('close', (code2) => {
    console.log('\n   Exit code:', code2);
    console.log('   Output length:', toolsOutput.length);
    if (toolsOutput.length > 0) {
      console.log('   Output:', toolsOutput.substring(0, 500));
    }
    
    // Check evidence
    const evidencePath = '/tmp/shadowvex_injection_evidence.txt';
    if (fs.existsSync(evidencePath)) {
      console.log('\n✅ Evidence file exists!');
      console.log(fs.readFileSync(evidencePath, 'utf8'));
    } else {
      console.log('\n❌ No evidence file');
    }
  });
});
