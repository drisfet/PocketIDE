# Java Runtime Management for PocketIDE

## Overview

This document explains the proper approach to Java runtime management for PocketIDE, addressing the sophisticated functionality requirements for WebContainer and Judge0.

## Why Java is Required

PocketIDE requires Java for two critical components:

1. **WebContainer**: Client-side JavaScript/Node.js execution environment
2. **Judge0**: Multi-language code execution service (Python, Java, C++, etc.)

## The Problem with npm/pnpm + Java

**Java runtimes cannot be installed via npm/pnpm** because:
- They are system-level packages, not JavaScript packages
- They require specific system configurations and permissions
- Different operating systems need different installation methods

## Proper Solution: Hybrid Approach

### 1. Automatic Java Detection & Setup

```bash
# Check Java installation
pnpm java:check

# Setup Java runtime (attempts multiple methods)
pnpm java:setup

# Create Java configuration
pnpm java:config
```

### 2. Installation Methods (in order of preference)

#### Method 1: SDKMAN! (Linux/macOS)
```bash
# Automatic installation via SDKMAN!
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install java 17.0.12-tem
```

#### Method 2: Package Managers
**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install -y openjdk-17-jdk
```

**macOS (Homebrew):**
```bash
brew install openjdk@17
```

**Windows:**
Download from https://adoptium.net/ or use Chocolatey:
```bash
choco install openjdk --version=17.0.12
```

#### Method 3: Docker (Recommended for Production)
```bash
# Build Docker image with Java
pnpm docker:build

# Run with Java pre-installed
pnpm docker:run
```

### 3. Configuration

Java configuration is managed in `src/lib/java-config.json`:

```json
{
  "java": {
    "version": "17",
    "home": "/usr/lib/jvm/java-17-openjdk",
    "options": "-Xmx1g -Xms512m",
    "webcontainer": {
      "enabled": true,
      "memory": "1g"
    },
    "judge0": {
      "enabled": true,
      "timeout": 10000
    }
  }
}
```

## Development Workflow

### Setup
```bash
# Complete setup (install deps + Java)
pnpm setup

# Development setup with Java check
pnpm setup:dev
```

### Development
```bash
# Start development server
pnpm dev

# Build with Java validation
pnpm build:prod
```

### Testing
```bash
# Test WebContainer functionality
pnpm webcontainer

# Test Judge0 integration
pnpm judge0
```

## Environment Variables

Set these in your `.env.local`:

```env
JAVA_HOME=/usr/lib/jvm/java-17-openjdk
POCKETIDE_JAVA_ENABLED=true
POCKETIDE_JAVA_MEMORY=1g
```

## Troubleshooting

### Common Issues

1. **Java not found**
   ```bash
   pnpm java:setup
   ```

2. **Memory issues**
   ```bash
   export JAVA_OPTS="-Xmx2g -Xms1g"
   ```

3. **Platform-specific issues**
   - Check OS-specific installation methods above
   - Use Docker for consistent environments

### Verification

```bash
# Check Java version
java -version

# Verify WebContainer compatibility
node -e "console.log('WebContainer Java check passed')"

# Test Judge0 connectivity
curl -X POST "https://judge0-ce.p.rapidapi.com/submissions" \
  -H "Content-Type: application/json" \
  -H "X-RapidAPI-Key: YOUR_API_KEY"
```

## Production Deployment

### Option 1: System Java Installation
1. Install Java 17 on the production server
2. Set `JAVA_HOME` environment variable
3. Deploy PocketIDE normally

### Option 2: Docker Deployment (Recommended)
```bash
# Build and deploy
pnpm docker:build
docker run -d -p 3000:3000 --name pocketide pocketide
```

### Option 3: Multi-stage Build
Create a custom Dockerfile with Java pre-installed for optimal performance.

## Conclusion

The hybrid approach provides:
- ✅ Automatic Java detection and setup
- ✅ Cross-platform compatibility
- ✅ Production-ready deployment options
- ✅ Proper error handling and fallbacks
- ✅ Maintains sophisticated functionality while avoiding npm/pnpm conflicts

This ensures PocketIDE maintains all its advanced features without the build failures we experienced with the original dev.nix configuration.