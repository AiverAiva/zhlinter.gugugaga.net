import { TextNormalizer } from "@/components/text-normalizer"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-20">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-balance">
              中文文案排版與格式規範工具
            </h1>
            <p className="text-sm text-muted-foreground">
              依據{" "}
              <a
                href="https://github.com/sparanoid/chinese-copywriting-guidelines"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-foreground underline decoration-foreground/20 hover:decoration-foreground/40 underline-offset-4 transition-colors duration-200"
              >
                《中文文案排版指北》
              </a>{" "}
              規範自動清理、調整中英文間距、標點與符號。
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <TextNormalizer />

        <footer className="mt-16 pt-8 border-t border-border/40">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>由</span>
            <a
              href="https://weikuwu.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-foreground underline decoration-foreground/20 hover:decoration-foreground/40 underline-offset-4 transition-colors duration-200"
            >
              AiverAiva
            </a>
            <span>製作與部屬</span>
            <span className="text-muted-foreground/50">·</span>
            <a
              href="https://github.com/AiverAiva/zhlinter.gugugaga.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/70 hover:text-foreground underline decoration-foreground/20 hover:decoration-foreground/40 underline-offset-4 transition-colors duration-200"
            >
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </main>
  )
}
