# PocketIDE Development Environment Configuration
# Mobile-first PWA IDE built with Next.js 15, TanStack Start, and modern web technologies
# Based on the 2025 stack for optimal mobile performance and touch UX

{ pkgs }: {
  # Use latest stable nixpkgs channel for 2025 compatibility
  channel = "stable-24.11";
  
  # Core development packages for PocketIDE
  packages = [
    # Node.js 20+ for Next.js 15 and modern JavaScript tooling
    pkgs.nodejs_20
    
    # Java for WebContainer and potentially other runtimes
    pkgs.jdk17
    
    # Zulu for Java compatibility (alternative to OpenJDK)
    pkgs.zulu
    
    # Essential build tools
    pkgs.nodejs_20.pkgs.pnpm  # For faster, disk-efficient package management
    pkgs.nodejs_20.pkgs.typescript  # TypeScript compiler
    pkgs.nodejs_20.pkgs.typescript-language-server  # TS language server
    pkgs.nodejs_20.pkgs.eslint  # Linter for code quality
    pkgs.nodejs_20.pkgs.postcss  # CSS post-processing
    pkgs.nodejs_20.pkgs.autoprefixer  # CSS prefixing
    
    # Development utilities
    pkgs.git  # Version control
    pkgs.watchman  # File watching for development
    pkgs.yq  # YAML processing for configuration
    
    # Mobile development tools
    pkgs.cordova  # For potential mobile app wrapping
    pkgs.ios-deploy  # For iOS device testing
    
    # Testing tools
    pkgs.jest  # JavaScript testing framework
    pkgs.playwright  # E2E testing with mobile device support
  ];
  
  # Environment variables for PocketIDE development
  env = {
    # Node.js environment
    NODE_ENV = "development";
    
    # TypeScript configuration
    TSC_NON_INCREMENTAL = "true";  # Better for mobile development workflows
    
    # PocketIDE specific
    POCKETIDE_VERSION = "1.0.0";
    NEXT_TELEMETRY_DISABLED = "1";  # Disable Next.js telemetry
    
    # Package manager configuration
    PNPM_PACKAGE_MANAGER = "true";  # Use pnpm as package manager
    
    # Supabase configuration (will be overridden by local .env)
    SUPABASE_URL = "https://your-project.supabase.co";
    SUPABASE_ANON_KEY = "your-anon-key";
    
    # Judge0 API configuration
    JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
    JUDGE0_API_KEY = "your-rapidapi-key";
    
    # Open VSX API configuration
    NEXT_PUBLIC_OPEN_VSX_API_URL = "https://open-vsx.org/api";
    
    # Monaco Editor configuration
    MONACO_EDITOR_WEBPACK_PLUGIN = "true";
    
    # Tailwind CSS configuration
    TAILwindCSS_CONFIG_PATH = "./tailwind.config.ts";
    
    # PWA configuration
    NEXT_PUBLIC_PWA_ENABLED = "true";
  };
  
  # VS Code extensions for PocketIDE development
  idx = {
    extensions = [
      # Essential extensions for web development
      "bradlc.vscode-tailwindcss"
      "ms-vscode.vscode-json"
      "esbenp.prettier-vscode"
      "ms-vscode.vscode-typescript-next"
      
      # Monaco Editor extensions
      "ms-vscode.vscode-json"
      "ms-vscode.vscode-css"
      
      # Git integration
      "github.vscode-pull-request-github"
      
      # Testing
      "ms-playwright.playwright"
      
      # Mobile development
      "ionic.ionic"
      
      # Radix UI and shadcn/ui support
      "unifiedjs.vscode-mdx"
      "bradlc.vscode-tailwindcss"
      
      # Database tools
      "mtxr.sqltools"
      "mtxr.sqltools-driver-pg"
      
      # API development
      "humao.rest-client"
      
      # Docker support
      "ms-azuretools.vscode-docker"
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
