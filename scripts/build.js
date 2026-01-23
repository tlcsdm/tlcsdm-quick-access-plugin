const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths - ROOT_DIR is the project root (parent of scripts folder)
const ROOT_DIR = path.dirname(__dirname);
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const ICONS_DIR = path.join(ROOT_DIR, 'icons');

/**
 * Remove directory recursively
 */
function rmdir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Create directory recursively
 */
function mkdir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Copy file
 */
function copyFile(src, dest) {
  fs.copyFileSync(src, dest);
}

/**
 * Copy directory recursively
 */
function copyDir(src, dest) {
  mkdir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

/**
 * Get all PNG files from a directory
 */
function getPngFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(file => file.endsWith('.png'));
}

/**
 * Escape string for use in shell command
 */
function escapeShellArg(arg) {
  // Escape backslashes first, then double quotes
  // This ensures proper handling on both Windows and Unix
  return arg.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * Create ZIP archive using built-in Node.js (requires archiver or manual implementation)
 * Falls back to system zip command if available
 */
function createZip(sourceDir, outputPath) {
  try {
    // Try using system zip command (works on most systems including Git Bash on Windows)
    const isWindows = process.platform === 'win32';
    const cwd = process.cwd();
    process.chdir(sourceDir);
    
    // Escape the output path for safe shell usage
    const safePath = escapeShellArg(outputPath);
    
    if (isWindows) {
      // On Windows, try PowerShell Compress-Archive
      // PowerShell uses single quotes for literal strings
      const psPath = outputPath.replace(/'/g, "''");
      try {
        execSync(`powershell -Command "Compress-Archive -Path * -DestinationPath '${psPath}' -Force"`, { stdio: 'pipe' });
      } catch {
        // Fallback to 7z if available
        try {
          execSync(`7z a -tzip "${safePath}" *`, { stdio: 'pipe' });
        } catch {
          // Fallback to zip command (Git Bash)
          execSync(`zip -r "${safePath}" .`, { stdio: 'pipe' });
        }
      }
    } else {
      // On Unix-like systems, use zip command
      execSync(`zip -r "${safePath}" .`, { stdio: 'pipe' });
    }
    
    process.chdir(cwd);
    return true;
  } catch (error) {
    console.error(`Warning: Could not create ZIP archive: ${error.message}`);
    console.log('Please install zip command or manually create ZIP files from dist directories.');
    return false;
  }
}

/**
 * Build extension for a specific platform
 */
function buildPlatform(platform) {
  console.log(`Building ${platform} extension...`);
  
  const platformDir = path.join(DIST_DIR, platform);
  mkdir(platformDir);
  
  // Copy manifest
  copyFile(
    path.join(SRC_DIR, platform, 'manifest.json'),
    path.join(platformDir, 'manifest.json')
  );
  
  // Copy shared files
  copyFile(
    path.join(SRC_DIR, 'shared', 'popup.html'),
    path.join(platformDir, 'popup.html')
  );
  copyFile(
    path.join(SRC_DIR, 'shared', 'popup.css'),
    path.join(platformDir, 'popup.css')
  );
  copyFile(
    path.join(SRC_DIR, 'shared', 'popup.js'),
    path.join(platformDir, 'popup.js')
  );
  
  // Copy images directory for link icons
  const imagesDir = path.join(SRC_DIR, 'shared', 'images');
  if (fs.existsSync(imagesDir)) {
    copyDir(imagesDir, path.join(platformDir, 'images'));
  }
  
  // Copy icons
  const iconsDestDir = path.join(platformDir, 'icons');
  mkdir(iconsDestDir);
  const pngFiles = getPngFiles(ICONS_DIR);
  if (pngFiles.length === 0) {
    console.log('Note: PNG icons not found. Please run "npm run generate-icons" first.');
  } else {
    pngFiles.forEach(file => {
      copyFile(
        path.join(ICONS_DIR, file),
        path.join(iconsDestDir, file)
      );
    });
  }
  
  // Copy locales for i18n support
  const localesDir = path.join(SRC_DIR, 'shared', '_locales');
  if (fs.existsSync(localesDir)) {
    copyDir(localesDir, path.join(platformDir, '_locales'));
  }
}

/**
 * Main build function
 */
function build() {
  console.log('TLCSDM Quick Access Plugin - Build Script\n');
  
  // Clean dist directory
  console.log('Cleaning dist directory...');
  rmdir(DIST_DIR);
  mkdir(DIST_DIR);
  
  // Build for each platform
  buildPlatform('chrome');
  buildPlatform('edge');
  
  // Create ZIP packages
  console.log('\nCreating ZIP packages...');
  const chromeZip = path.join(DIST_DIR, 'tlcsdm-quick-access-chrome.zip');
  const edgeZip = path.join(DIST_DIR, 'tlcsdm-quick-access-edge.zip');
  
  createZip(path.join(DIST_DIR, 'chrome'), chromeZip);
  createZip(path.join(DIST_DIR, 'edge'), edgeZip);
  
  console.log('\nBuild complete!');
  console.log(`Chrome extension: ${chromeZip}`);
  console.log(`Edge extension: ${edgeZip}`);
  console.log('\nTo install for development:');
  console.log(`  Chrome: Go to chrome://extensions, enable Developer mode, click 'Load unpacked', select ${path.join(DIST_DIR, 'chrome')}`);
  console.log(`  Edge: Go to edge://extensions, enable Developer mode, click 'Load unpacked', select ${path.join(DIST_DIR, 'edge')}`);
}

// Run build
build();
