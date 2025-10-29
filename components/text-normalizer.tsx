"use client"

import * as React from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { normalizeText } from "zhlinter";

interface DiffPart {
  type: "added" | "removed" | "unchanged"
  text: string
}

function calculateDiff(input: string, output: string): DiffPart[] {
  // Use Myers diff algorithm (simplified version)
  const inputChars = Array.from(input)
  const outputChars = Array.from(output)

  // Build LCS table
  const m = inputChars.length
  const n = outputChars.length
  const lcs: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (inputChars[i - 1] === outputChars[j - 1]) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1])
      }
    }
  }

  // Backtrack to build diff
  const diff: DiffPart[] = []
  let i = m
  let j = n

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && inputChars[i - 1] === outputChars[j - 1]) {
      // Characters match - prepend to avoid reversing later
      if (diff.length > 0 && diff[0].type === "unchanged") {
        diff[0].text = inputChars[i - 1] + diff[0].text
      } else {
        diff.unshift({ type: "unchanged", text: inputChars[i - 1] })
      }
      i--
      j--
    } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
      // Character added in output
      if (diff.length > 0 && diff[0].type === "added") {
        diff[0].text = outputChars[j - 1] + diff[0].text
      } else {
        diff.unshift({ type: "added", text: outputChars[j - 1] })
      }
      j--
    } else if (i > 0) {
      // Character removed from input
      if (diff.length > 0 && diff[0].type === "removed") {
        diff[0].text = inputChars[i - 1] + diff[0].text
      } else {
        diff.unshift({ type: "removed", text: inputChars[i - 1] })
      }
      i--
    }
  }

  return diff
}

export function TextNormalizer() {
  const [input, setInput] = React.useState("")
  const [output, setOutput] = React.useState("")
  const [diff, setDiff] = React.useState<DiffPart[]>([])
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (input) {
      const normalized = normalizeText(input)
      setOutput(normalized)
      setDiff(calculateDiff(input, normalized))
    } else {
      setOutput("")
      setDiff([])
    }
  }, [input])

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const stats = React.useMemo(() => {
    const added = diff.filter((part) => part.type === "added").reduce((sum, part) => sum + part.text.length, 0)
    const removed = diff.filter((part) => part.type === "removed").reduce((sum, part) => sum + part.text.length, 0)
    return { added, removed }
  }, [diff])

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Input Section */}
      <div className="flex flex-col gap-2">
        <label htmlFor="input" className="text-sm font-medium text-muted-foreground">
          輸入
        </label>
        <Textarea
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="在這裡輸入或貼上欲調整的文本..."
          className="min-h-[200px] resize-none bg-card border-border focus-visible:ring-1 focus-visible:ring-ring font-sans text-[15px] leading-relaxed"
        />
      </div>

      {/* Output Section with copy button */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="output" className="text-sm font-medium text-muted-foreground">
            輸出
          </label>
          <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output} className="h-8 gap-2 text-xs">
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                已複製
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                複製
              </>
            )}
          </Button>
        </div>

        {output ? (
          <Textarea
            id="output"
            value={output}
            readOnly
            className="min-h-[200px] resize-none bg-card border-border font-sans text-[15px] leading-relaxed"
          />
        ) : (
          <div className="min-h-[200px] rounded-lg border border-border bg-card p-4 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">標準化後的文本會在這裡顯示</p>
          </div>
        )}
      </div>

      {/* Compare Section with diff visualization */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-muted-foreground">比較</label>
          {output && (stats.added > 0 || stats.removed > 0) && (
            <div className="flex items-center gap-2 text-xs">
              {stats.added > 0 && <span className="text-[var(--diff-added)] font-medium">+{stats.added}</span>}
              {stats.removed > 0 && <span className="text-[var(--diff-removed)] font-medium">-{stats.removed}</span>}
            </div>
          )}
        </div>

        {output ? (
          <div className="min-h-[200px] rounded-lg border border-border bg-card p-4 font-sans text-[15px] leading-relaxed overflow-auto">
            {diff.map((part, index) => (
              <span
                key={index}
                className={cn(
                  "whitespace-pre-wrap break-words",
                  part.type === "added" && "bg-[var(--diff-added-bg)] text-[var(--diff-added)]",
                  part.type === "removed" && "bg-[var(--diff-removed-bg)] text-[var(--diff-removed)] line-through",
                )}
              >
                {part.text}
              </span>
            ))}
          </div>
        ) : (
          <div className="min-h-[200px] rounded-lg border border-border bg-card p-4 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">比較結果會在這裡顯示</p>
          </div>
        )}
      </div>
    </div>
  )
}
