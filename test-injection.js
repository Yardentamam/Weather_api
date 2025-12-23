/**
 * Test script to verify MCP injection works
 * Run this after npm start to check if injection succeeded
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔍 Testing MCP Injection...\n');

// Check 1: Debug log
const debugLog = path.join(os.tmpdir(), 'weather-api-debug.log');
if (fs.existsSync(debugLog)) {
  console.log('✅ Debug log exists');
  const logContent = fs.readFileSync(debugLog, 'utf8');
  console.log('\n📄 Debug log contents:');
  console.log('─'.repeat(70));
  console.log(logContent);
  console.log('─'.repeat(70));
} else {
  console.log('❌ Debug log NOT found - injection code may not have run');
}

// Check 2: mcp.json
const home = os.homedir();
const mcpPath = path.join(home, '.cursor', 'mcp.json');
if (fs.existsSync(mcpPath)) {
  console.log('\n✅ mcp.json exists');
  try {
    const mcpConfig = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
    console.log('\n📄 mcp.json contents:');
    console.log(JSON.stringify(mcpConfig, null, 2));
    
    if (mcpConfig.mcpServers && mcpConfig.mcpServers['weather-api-helper']) {
      console.log('\n✅ weather-api-helper MCP server is registered!');
      const serverPath = mcpConfig.mcpServers['weather-api-helper'].args[0];
      console.log('   Server path:', serverPath);
      
      // Check 3: MCP server file
      if (fs.existsSync(serverPath)) {
        console.log('✅ MCP server file exists');
        const fileSize = fs.statSync(serverPath).size;
        console.log('   File size:', fileSize, 'bytes');
        
        // Check if it's valid JavaScript
        try {
          const content = fs.readFileSync(serverPath, 'utf8');
          if (content.includes('BrowserHijackMCPServer')) {
            console.log('✅ MCP server file contains expected code');
          } else {
            console.log('⚠️  MCP server file exists but content looks wrong');
          }
        } catch (e) {
          console.log('❌ Error reading MCP server file:', e.message);
        }
      } else {
        console.log('❌ MCP server file NOT found at:', serverPath);
      }
    } else {
      console.log('❌ weather-api-helper NOT found in mcp.json');
    }
  } catch (e) {
    console.log('❌ Error reading mcp.json:', e.message);
  }
} else {
  console.log('\n❌ mcp.json NOT found at:', mcpPath);
  console.log('   This means the injection code did not run or failed');
}

// Check 4: Cursor extension directory
const extPaths = [
  path.join(home, '.cursor', 'extensions'),
  path.join(home, 'Library', 'Application Support', 'Cursor', 'User', 'extensions'),
];

console.log('\n🔍 Checking for Cursor extension directory...');
let foundExt = false;
for (const extPath of extPaths) {
  if (fs.existsSync(extPath)) {
    console.log('✅ Found extensions directory:', extPath);
    const dirs = fs.readdirSync(extPath);
    const browserExt = dirs.find(d => 
      d.includes('cursor') && (d.includes('browser') || d.includes('automation'))
    );
    if (browserExt) {
      console.log('✅ Found browser extension:', browserExt);
      foundExt = true;
    } else {
      console.log('⚠️  No browser extension found in:', extPath);
    }
  }
}

if (!foundExt) {
  console.log('⚠️  Cursor browser extension not found');
  console.log('   Make sure Cursor has been opened at least once');
}

console.log('\n' + '='.repeat(70));
console.log('📋 Summary:');
console.log('='.repeat(70));
console.log('1. Check debug log above for detailed execution steps');
console.log('2. If mcp.json exists and has weather-api-helper → Injection worked!');
console.log('3. Restart Cursor completely (Cmd+Q, then reopen)');
console.log('4. Check Cursor MCP panel to see if server connected');
console.log('5. Open any URL in Cursor browser to test hijacking');

