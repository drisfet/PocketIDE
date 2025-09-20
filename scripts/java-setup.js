#!/usr/bin/env node

/**
 * Java Runtime Setup for PocketIDE
 * Handles WebContainer and Judge0 Java requirements
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Java runtime for PocketIDE...');

// Check if Java is available
function checkJava() {
  try {
    const javaVersion = execSync('java -version', { encoding: 'utf8' });
    console.log('✅ Java already installed:');
    console.log(javaVersion);
    return true;
  } catch (error) {
    console.log('❌ Java not found. Installing...');
    return false;
  }
}

// Install Java using SDKMAN! (if available)
function installJavaWithSDKMAN() {
  try {
    execSync('curl -s "https://get.sdkman.io" | bash', { stdio: 'inherit' });
    execSync('source "$HOME/.sdkman/bin/sdkman-init.sh" && sdk install java 17.0.12-tem', { 
      stdio: 'inherit',
      shell: true 
    });
    console.log('✅ Java 17 installed via SDKMAN!');
    return true;
  } catch (error) {
    console.log('⚠️  SDKMAN not available, trying manual installation...');
    return false;
  }
}

// Install Java using package manager (Ubuntu/Debian)
function installJavaWithAPT() {
  try {
    execSync('sudo apt update && sudo apt install -y openjdk-17-jdk', { stdio: 'inherit' });
    console.log('✅ Java 17 installed via APT!');
    return true;
  } catch (error) {
    console.log('⚠️  APT failed, trying other methods...');
    return false;
  }
}

// Install Java using Homebrew (macOS)
function installJavaWithBrew() {
  try {
    execSync('brew install openjdk@17', { stdio: 'inherit' });
    console.log('✅ Java 17 installed via Homebrew!');
    return true;
  } catch (error) {
    console.log('⚠️  Homebrew failed, trying other methods...');
    return false;
  }
}

// Create Java configuration
function createJavaConfig() {
  const config = {
    java: {
      version: '17',
      home: process.env.JAVA_HOME || '/usr/lib/jvm/java-17-openjdk',
      options: '-Xmx1g -Xms512m',
      webcontainer: {
        enabled: true,
        memory: '1g'
      },
      judge0: {
        enabled: true,
        timeout: 10000
      }
    }
  };

  const configPath = path.join(__dirname, '../src/lib/java-config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✅ Java configuration created at:', configPath);
}

// Main setup function
function setupJava() {
  if (checkJava()) {
    createJavaConfig();
    return;
  }

  // Try different installation methods
  const methods = [
    installJavaWithSDKMAN,
    installJavaWithAPT,
    installJavaWithBrew
  ];

  for (const method of methods) {
    if (method()) {
      createJavaConfig();
      return;
    }
  }

  console.log('❌ Could not install Java automatically.');
  console.log('Please install Java 17 manually:');
  console.log('  Ubuntu/Debian: sudo apt install openjdk-17-jdk');
  console.log('  macOS: brew install openjdk@17');
  console.log('  Windows: Download from https://adoptium.net/');
  process.exit(1);
}

// Run setup
if (require.main === module) {
  setupJava();
}

module.exports = { setupJava, checkJava };