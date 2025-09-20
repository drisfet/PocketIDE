'use client'

import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface CodeEditorProps {
  value?: string
  language?: string
  theme?: 'vs-dark' | 'light'
  onChange?: (value: string | undefined) => void
  className?: string
  readOnly?: boolean
  minimap?: boolean
  lineNumbers?: 'on' | 'off' | 'relative'
  fontSize?: number
}

export function CodeEditor({
  value = '',
  language = 'javascript',
  theme = 'vs-dark',
  onChange,
  className,
  readOnly = false,
  minimap = true,
  lineNumbers = 'on',
  fontSize = 14,
}: CodeEditorProps) {
  const [isReady, setIsReady] = useState(false)
  const editorRef = useRef<any>(null)

  // Handle Monaco Editor ready
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    
    // Configure editor for mobile use
    editor.updateOptions({
      fontSize,
      minimap: { enabled: minimap },
      lineNumbers,
      wordWrap: 'on',
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderLineHighlight: 'all',
      selectOnLineNumbers: true,
      matchBrackets: 'always',
      autoIndent: 'advanced',
      formatOnPaste: true,
      formatOnType: true,
    })

    // Add touch gesture support
    editor.addCommand(editor.KeyCode.KEY_S, () => {
      // Save command (Ctrl+S / Cmd+S)
      if (onChange) {
        onChange(editor.getValue())
      }
    })

    setIsReady(true)
  }

  // Handle editor changes
  const handleEditorChange = (value: string | undefined) => {
    if (onChange) {
      onChange(value)
    }
  }

  // Load extensions from Open VSX
  useEffect(() => {
    const loadExtensions = async () => {
      try {
        // This would typically fetch extensions from Open VSX API
        // For now, we'll set up basic language support
        const extensions = [
          'vscode.typescript-language-features',
          'vscode.json',
          'vscode.css',
          'vscode.html',
          'vscode.powershell',
          'vscode.python',
          'vscode.java',
          'vscode.go',
          'vscode.php',
          'vscode.rust',
        ]

        // In a real implementation, you would:
        // 1. Fetch from Open VSX API: https://open-vsx.org/api/{publisher}/{name}
        // 2. Download and load extensions
        // 3. Configure Monaco to use them
        
        console.log('Extensions to load:', extensions)
      } catch (error) {
        console.error('Failed to load extensions:', error)
      }
    }

    if (isReady) {
      loadExtensions()
    }
  }, [isReady])

  return (
    <div className={cn('relative w-full h-full', className)}>
      <Editor
        height="100%"
        language={language}
        theme={theme}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          fontSize,
          minimap: { enabled: minimap },
          lineNumbers,
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderLineHighlight: 'all',
          selectOnLineNumbers: true,
          matchBrackets: 'always',
          autoIndent: 'advanced',
          formatOnPaste: true,
          formatOnType: true,
          // Mobile-specific optimizations
          mouseWheelZoom: true,
          cursorSurroundingLines: 0,
          cursorSurroundingLinesStyle: 'all',
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
      />
      
      {/* Mobile toolbar overlay */}
      <div className="absolute bottom-2 right-2 flex gap-1">
        <button
          onClick={() => {
            if (editorRef.current) {
              editorRef.current.trigger('keyboard', 'editor.action.formatDocument', null)
            }
          }}
          className="p-2 bg-background border border-border rounded-md shadow-sm hover:bg-accent"
          title="Format Code"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <button
          onClick={() => {
            if (editorRef.current) {
              editorRef.current.trigger('keyboard', 'editor.action.undo', null)
            }
          }}
          className="p-2 bg-background border border-border rounded-md shadow-sm hover:bg-accent"
          title="Undo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        
        <button
          onClick={() => {
            if (editorRef.current) {
              editorRef.current.trigger('keyboard', 'editor.action.redo', null)
            }
          }}
          className="p-2 bg-background border border-border rounded-md shadow-sm hover:bg-accent"
          title="Redo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}