'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Square, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TerminalProps {
  className?: string
  onRun?: () => void
  onStop?: () => void
  onClear?: () => void
  output?: string
  isRunning?: boolean
  height?: string
}

export function Terminal({
  className,
  onRun,
  onStop,
  onClear,
  output = '',
  isRunning = false,
  height = '300px',
}: TerminalProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const outputEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [output])

  const handleRun = () => {
    if (onRun) onRun()
  }

  const handleStop = () => {
    if (onStop) onStop()
  }

  const handleClear = () => {
    if (onClear) onClear()
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const terminalHeight = isExpanded ? '60vh' : height

  return (
    <Card className={cn('w-full border-border', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Terminal</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpand}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0"
              disabled={!output}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={isRunning ? handleStop : handleRun}
              className="h-8 w-8 p-0"
            >
              {isRunning ? (
                <Square className="h-4 w-4 text-red-500" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <ScrollArea className={cn('w-full', isExpanded ? 'h-[60vh]' : `h-[${height}]`)}>
            <div className="font-mono text-xs leading-relaxed p-4 bg-background min-h-[100px]">
              {output ? (
                <pre className="whitespace-pre-wrap break-words">{output}</pre>
              ) : (
                <div className="text-muted-foreground">
                  Terminal ready. Click Run to execute your code.
                </div>
              )}
              <div ref={outputEndRef} />
            </div>
          </ScrollArea>
          
          {/* Mobile-friendly overlay buttons */}
          <div className="absolute bottom-2 right-2 flex gap-1 md:hidden">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClear}
              disabled={!output}
              className="h-8 text-xs"
            >
              Clear
            </Button>
            <Button
              variant={isRunning ? "destructive" : "default"}
              size="sm"
              onClick={isRunning ? handleStop : handleRun}
              className="h-8 text-xs"
            >
              {isRunning ? 'Stop' : 'Run'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Terminal input component for interactive sessions
export function TerminalInput({
  onSubmit,
  placeholder = 'Enter command...',
  className,
}: {
  onSubmit: (command: string) => void
  placeholder?: string
  className?: string
}) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input.trim())
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <span className="text-muted-foreground font-maco text-sm">$</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground"
        autoFocus
      />
    </form>
  )
}