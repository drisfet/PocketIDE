import { WebContainer } from '@webcontainer/api'
import axios from 'axios'

export interface ExecutionResult {
  output: string
  error?: string
  exitCode?: number
  executionTime: number
}

export interface RuntimeEnvironment {
  type: 'webcontainer' | 'judge0'
  language: string
  version?: string
}

// WebContainer runtime for JavaScript/Node.js
export class WebContainerRuntime {
  private webContainer: WebContainer | null = null
  private isInitialized = false

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      this.webContainer = await WebContainer.boot()
      this.isInitialized = true
      console.log('WebContainer initialized successfully')
    } catch (error) {
      console.error('Failed to initialize WebContainer:', error)
      throw new Error('Failed to initialize runtime environment')
    }
  }

  async installDependencies(dependencies: { [key: string]: string }): Promise<void> {
    if (!this.webContainer) {
      throw new Error('WebContainer not initialized')
    }

    const packageJson = {
      name: 'pocketide-project',
      version: '1.0.0',
      dependencies,
    }

    await this.webContainer.mount({
      'package.json': {
        file: {
          contents: JSON.stringify(packageJson, null, 2),
        },
      },
    })

    const installProcess = await this.webContainer.spawn('npm', ['install'])
    await installProcess.exit

    console.log('Dependencies installed successfully')
  }

  async executeCode(code: string, language: string = 'javascript'): Promise<ExecutionResult> {
    if (!this.webContainer) {
      throw new Error('WebContainer not initialized')
    }

    const startTime = Date.now()

    try {
      // Create a temporary file with the code
      const fileName = language === 'typescript' ? 'index.ts' : 'index.js'
      await this.webContainer.mount({
        [fileName]: {
          file: {
            contents: code,
          },
        },
      })

      // Install dependencies if needed
      if (language === 'typescript') {
        await this.installDependencies({
          typescript: '^5.0.0',
        })
      }

      // Execute the code
      const runProcess = await this.webContainer.spawn('node', [fileName])
      const output = await runProcess.output
      const exitCode = await runProcess.exit

      const executionTime = Date.now() - startTime

      return {
        output: typeof output === 'string' ? output : '',
        exitCode,
        executionTime,
      }
    } catch (error) {
      const executionTime = Date.now() - startTime
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
      }
    }
  }

  async cleanup(): Promise<void> {
    if (this.webContainer) {
      await this.webContainer.teardown()
      this.webContainer = null
      this.isInitialized = false
    }
  }
}

// Judge0 runtime for other languages
export class Judge0Runtime {
  private apiUrl: string
  private apiKey: string

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl
    this.apiKey = apiKey
  }

  async executeCode(code: string, language: string): Promise<ExecutionResult> {
    const startTime = Date.now()

    try {
      // Map language identifiers to Judge0 language IDs
      const languageMap: Record<string, number> = {
        'c': 50,
        'cpp': 54,
        'java': 62,
        'python': 71,
        'php': 68,
        'ruby': 72,
        'go': 57,
        'rust': 73,
        'kotlin': 63,
        'swift': 82,
        'typescript': 74,
        'javascript': 63,
      }

      const languageId = languageMap[language.toLowerCase()] || 71 // Default to Python

      const submission = {
        source_code: code,
        language_id: languageId,
        stdin: '',
        expected_output: '',
        compile_only: false,
      }

      const response = await axios.post(`${this.apiUrl}/submissions`, submission, {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      })

      const submissionToken = response.data.token

      // Poll for results
      let result
      let attempts = 0
      const maxAttempts = 30 // 30 seconds timeout

      do {
        await new Promise(resolve => setTimeout(resolve, 1000))
        attempts++
        
        const resultResponse = await axios.get(`${this.apiUrl}/submissions/${submissionToken}`, {
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          },
        })
        
        result = resultResponse.data
      } while (result.status?.id <= 2 && attempts < maxAttempts)

      const executionTime = Date.now() - startTime

      if (result.status?.id === 3) { // Accepted
        return {
          output: result.stdout || '',
          executionTime,
        }
      } else {
        return {
          output: '',
          error: result.stderr || result.compile_output || 'Execution failed',
          executionTime,
        }
      }
    } catch (error) {
      const executionTime = Date.now() - startTime
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
      }
    }
  }
}

// Runtime factory
export function createRuntime(env: RuntimeEnvironment): WebContainerRuntime | Judge0Runtime {
  if (env.type === 'webcontainer') {
    return new WebContainerRuntime()
  } else {
    const apiUrl = process.env.NEXT_PUBLIC_JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'
    const apiKey = process.env.NEXT_PUBLIC_JUDGE0_API_KEY || ''
    return new Judge0Runtime(apiUrl, apiKey)
  }
}

// Determine runtime environment based on language
export function getRuntimeEnvironment(language: string): RuntimeEnvironment {
  const webContainerLanguages = ['javascript', 'typescript', 'node']
  
  if (webContainerLanguages.includes(language.toLowerCase())) {
    return {
      type: 'webcontainer',
      language: language.toLowerCase(),
    }
  } else {
    return {
      type: 'judge0',
      language: language.toLowerCase(),
    }
  }
}