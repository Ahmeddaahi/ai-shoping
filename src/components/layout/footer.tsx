import Link from "next/link"
import { Github, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <Link
              href="https://github.com/yourusername"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Your Name
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com/yourusername/ai-shoping"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="https://twitter.com/yourusername"
            target="_blank"
            rel="noreferrer"
          >
            <Twitter className="h-4 w-4" />
          </Link>
          <Link
            href="https://github.com/yourusername"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  )
} 