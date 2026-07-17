"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import type { BundledLanguage, BundledTheme, SpecialLanguage } from "shiki";
import { codeToHtml } from "shiki";

import { Badge } from "@forthtilliath/shadcn-ui/components/badge";
import { Button } from "@forthtilliath/shadcn-ui/components/button";
import { cn } from "@forthtilliath/shadcn-ui/lib/utils";

export interface CodeBlockProps {
  code: string;
  language?: BundledLanguage | SpecialLanguage;
  /** Shown in the header, before the language badge. */
  filename?: string;
  /**
   * @default { light: "github-light", dark: "github-dark" }
   */
  theme?: { light: BundledTheme; dark: BundledTheme };
  showLineNumbers?: boolean;
  className?: string;
}

const DEFAULT_THEME = { light: "github-light", dark: "github-dark" } as const;
const COPY_FEEDBACK_MS = 2000;

/**
 * A syntax-highlighted code block with a copy-to-clipboard button, an
 * optional filename/language header, and optional line numbers.
 *
 * _Inspired from multiple sources, to make a consistent and reusable component._
 * @see https://www.kibo-ui.com/components/code-block
 * @see https://ui.aceternity.com/components/code-block
 *
 * @version 0.1.0
 * @author Forth
 * @copyright 2026 Forth
 */
export function CodeBlock({
  code,
  language = "text",
  filename,
  theme = DEFAULT_THEME,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [html, setHtml] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    void codeToHtml(code, {
      lang: language,
      themes: theme,
      defaultColor: false,
    }).then((result) => {
      if (!cancelled) {
        setHtml(result);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [code, language, theme]);

  function handleCopy() {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, COPY_FEEDBACK_MS);
    });
  }

  return (
    <div
      className={cn(
        "border-border bg-card overflow-hidden rounded-lg border text-sm",
        className,
      )}
    >
      {(filename ?? language !== "text") && (
        <div className="border-border bg-muted/40 flex items-center justify-between border-b px-3 py-1.5">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="text-muted-foreground font-mono text-xs">
                {filename}
              </span>
            )}
            <Badge variant="outline" className="font-mono text-[10px]">
              {language}
            </Badge>
          </div>
        </div>
      )}
      <div className="group relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="absolute top-2 right-2 size-7 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
        {html ? (
          <div
            className={cn(
              "[&_pre]:overflow-x-auto [&_pre]:p-4",
              showLineNumbers &&
                "[&_code]:[counter-reset:line] [&_.line]:[counter-increment:line] [&_.line]:before:text-muted-foreground [&_.line]:before:mr-4 [&_.line]:before:inline-block [&_.line]:before:w-4 [&_.line]:before:text-right [&_.line]:before:content-[counter(line)]",
            )}
            // Shiki generates static markup from the given `code` string
            // server-side-safe (no user input reaches this beyond the
            // developer-supplied `code` prop), same trust boundary as
            // ChartStyle's dangerouslySetInnerHTML elsewhere in this repo.
            // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="overflow-x-auto p-4">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
