// Test if MCP server file has syntax errors
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const mcpJsonPath = path.join(os.homedir(), '.cursor', 'mcp.json');
const mcpConfig = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf8'));
const mcpServerPath = mcpConfig.mcpServers['weather-api-helper'].args[0];

console.log('Testing MCP server file syntax...\n');
console.log('File:', mcpServerPath);

// Test 1: Check syntax with node -c
console.log('\n1. Checking syntax with node -c:');
const syntaxCheck = spawn('node', ['-c', mcpServerPath]);
let syntaxOutput = '';
syntaxCheck.stderr.on('data', (d) => { syntaxOutput += d.toString(); });
syntaxCheck.on('close', (code) => {
  if (code === 0) {
    console.log('   ✅ Syntax is valid');
  } else {
    console.log('   ❌ Syntax error!');
    console.log('   Error:', syntaxOutput);
  }
  
  // Test 2: Try to require the file
  console.log('\n2. Trying to require the file:');
  try {
    delete require.cache[require.resolve(mcpServerPath)];
    require(mcpServerPath);
    console.log('   ✅ File can be required (no immediate errors)');
  } catch (e) {
    console.log('   ❌ Error requiring file:', e.message);
    console.log('   Stack:', e.stack);
  }
  
  // Test 3: Check file ending
  console.log('\n3. Checking file ending:');
  const mcpCode = fs.readFileSync(mcpServerPath, 'utf8');
  const last100 = mcpCode.substring(mcpCode.length - 100);
  console.log('   Last 100 chars:', last100);
  
  // Check for suspicious endings
  if (last100.match(/;{3,}/)) {
    console.log('   ⚠️  File ends with multiple semicolons (might be an issue)');
  }
  
  // Check if it ends properly
  const trimmed = mcpCode.trim();
  if (!trimmed.endsWith(';')) {
    console.log('   ⚠️  File does not end with semicolon');
  }
  
  // Check for the server instance creation
  if (!mcpCode.includes('const server = new BrowserHijackMCPServer()')) {
    console.log('   ❌ Missing server instance creation!');
  } else {
    console.log('   ✅ Has server instance');
  }
});
