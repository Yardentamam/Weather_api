// Script to find where Cursor's browser extensions actually are
const fs = require('fs');
const path = require('path');
const os = require('os');

const home = os.homedir();
const platform = os.platform();

console.log('🔍 Searching for Cursor browser extension files...\n');

// Check all possible locations
const locations = [
  // User extension directories
  path.join(home, '.cursor', 'extensions'),
  path.join(home, 'Library', 'Application Support', 'Cursor', 'User', 'extensions'),
  path.join(home, '.vscode', 'extensions'),
  
  // Cursor installation directories (Mac)
  '/Applications/Cursor.app/Contents/Resources/app/extensions',
  '/Applications/Cursor.app/Contents',
  
  // Downloads
  ...(fs.existsSync(path.join(home, 'Downloads')) 
    ? fs.readdirSync(path.join(home, 'Downloads'))
        .filter(f => f.toLowerCase().startsWith('cursor-'))
        .map(f => path.join(home, 'Downloads', f, 'Contents', 'Resources', 'app', 'extensions'))
    : []),
  
  // Volumes
  ...(fs.existsSync('/Volumes')
    ? fs.readdirSync('/Volumes')
        .filter(v => v.toLowerCase().includes('cursor'))
        .map(v => path.join('/Volumes', v, 'Cursor.app', 'Contents', 'Resources', 'app', 'extensions'))
    : []),
];

// Recursive search function
function findBrowserFiles(dir, depth = 0, maxDepth = 6) {
  if (depth > maxDepth) return [];
  const results = [];
  
  try {
    if (!fs.existsSync(dir)) return results;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      try {
        if (fs.statSync(fullPath).isDirectory()) {
          results.push(...findBrowserFiles(fullPath, depth + 1, maxDepth));
        } else {
          const fileLower = file.toLowerCase();
          if ((fileLower.includes('browser') || fileLower.includes('webview') || 
               fileLower.includes('uiscript') || fileLower.includes('web')) &&
              (file.endsWith('.ts') || file.endsWith('.js'))) {
            results.push(fullPath);
          }
        }
      } catch (_) {}
    }
  } catch (_) {}
  
  return results;
}

// Check each location
for (const loc of locations) {
  if (fs.existsSync(loc)) {
    console.log(`✅ Found: ${loc}`);
    
    // Check if it's a directory with extensions
    if (fs.statSync(loc).isDirectory()) {
      const dirs = fs.readdirSync(loc);
      console.log(`   Contains ${dirs.length} items`);
      
      // Look for browser-related extensions
      for (const dir of dirs) {
        const fullPath = path.join(loc, dir);
        if (fs.statSync(fullPath).isDirectory()) {
          const dirLower = dir.toLowerCase();
          if (dirLower.includes('browser') || dirLower.includes('webview') || dirLower.includes('web')) {
            console.log(`   📁 Browser extension: ${dir}`);
          }
        }
      }
      
      // Search for browser files
      const browserFiles = findBrowserFiles(loc, 0, 4);
      if (browserFiles.length > 0) {
        console.log(`   📄 Found ${browserFiles.length} browser-related files:`);
        browserFiles.slice(0, 5).forEach(f => console.log(`      - ${f}`));
      }
    }
    console.log('');
  }
}

console.log('\n💡 If no browser files were found, Cursor might not have them installed yet.');
console.log('   Try opening Cursor and using the browser feature first.');
