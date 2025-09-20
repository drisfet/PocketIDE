# PocketIDE Development Environment Configuration
# Mobile-first PWA IDE built with Next.js 15, TanStack Start, and modern web technologies
# Based on the 2025 stack for optimal mobile performance and touch UX

{ pkgs }: {
  # Use latest stable nixpkgs channel for 2025 compatibility
  channel = "stable-24.11";
  
  # Core development packages for PocketIDE - minimal and focused
  packages = [
    # Node.js 20+ for Next.js 15 and modern JavaScript tooling
    pkgs.nodejs_20
    
    # Essential build tools (using nodejs_20.pkgs for availability)
    pkgs.nodejs_20.pkgs.pnpm  # For faster, disk-efficient package management
    
    # Development utilities
    pkgs.git  # Version control
    
    # Optional: Java for WebContainer/Judge0 (remove if not needed)
    # pkgs.jdk17  # Only required for WebContainer runtime
  ];
  
  # Environment variables for PocketIDE development - minimal and focused
  env = {
    # Node.js environment
    NODE_ENV = "development";
    
    # PocketIDE specific
    POCKETIDE_VERSION = "1.0.0";
    
    # Disable Next.js telemetry for cleaner development
    NEXT_TELEMETRY_DISABLED = "1";
  };
  
  # VS Code extensions for PocketIDE development - minimal and focused
  idx = {
    extensions = [
      # Essential extensions for web development
      "bradlc.vscode-tailwindcss"  # Tailwind CSS IntelliSense
      "ms-vscode.vscode-json"      # JSON support
      "esbenp.prettier-vscode"     # Code formatting
      "ms-vscode.vscode-typescript-next"  # TypeScript support
      
      # Git integration
      "github.vscode-pull-request-github"  # GitHub PR support
    ];
    
    # Workspace configuration
    workspace = {
      # Open files when workspace is created
      onCreate = {
        default.openFiles = [
          "src/app/page.tsx"
          "src/app/layout.tsx"
          "package.json"
          "next.config.ts"
          "tailwind.config.ts"
          "src/components/Editor.tsx"
          "src/components/Terminal.tsx"
          "src/lib/supabase.ts"
          "src/lib/runtime.ts"
          "src/lib/extensions.ts"
        ];
        
        # Install dependencies automatically using pnpm
        command = "pnpm install && git init";
      };
      
      # On start commands
      onStart = {
        # Start development server
        command = "pnpm dev";
        
        # Additional services if needed (commented out by default)
        # command = "pnpm dev & pnpm judge0-server";
      };
    };
    
    # Previews configuration for mobile-first development
    previews = {
      enable = true;
      previews = {
        # Main web development server
        web = {
          command = ["pnpm" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
          
          # Environment variables for web preview
          env = {
            NEXT_PUBLIC_APP_URL = "http://localhost:$PORT";
          };
        };
        
        # PWA preview (for testing installable web app)
        pwa = {
          command = ["pnpm" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
          env = {
            NEXT_PUBLIC_APP_URL = "http://localhost:$PORT";
            PWA_MODE = "true";
          };
        };
        
        # Mobile device preview (using browser device emulation)
        mobile = {
          command = ["pnpm" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          manager = "web";
          env = {
            NEXT_PUBLIC_APP_URL = "http://localhost:$PORT";
            MOBILE_DEVICE = "iphone-14";
          };
        };
      };
    };
  };
}
