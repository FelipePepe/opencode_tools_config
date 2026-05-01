import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { tool } from "@opencode-ai/plugin"

const execFileAsync = promisify(execFile)

async function runGit(args: string[], cwd: string) {
  return execFileAsync("git", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
  })
}

export const status = tool({
  description: "Inspect the current git branch, status, and changed files in the active worktree.",
  args: {},
  async execute(_args, context) {
    const cwd = context.worktree ?? context.directory

    try {
      const [{ stdout: branch }, { stdout: statusOutput }] = await Promise.all([
        runGit(["rev-parse", "--abbrev-ref", "HEAD"], cwd),
        runGit(["status", "--short"], cwd),
      ])

      const changedFiles = statusOutput
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)

      return JSON.stringify(
        {
          worktree: cwd,
          branch: branch.trim(),
          clean: changedFiles.length === 0,
          changedFiles,
        },
        null,
        2,
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return `Unable to inspect git status in ${cwd}: ${message}`
    }
  },
})

export const diff_summary = tool({
  description: "Summarize the current git diff, optionally against a specific base ref.",
  args: {
    baseRef: tool.schema
      .string()
      .optional()
      .describe("Optional git ref to diff against, for example main or origin/main."),
    maxLines: tool.schema
      .number()
      .int()
      .min(20)
      .max(400)
      .optional()
      .describe("Maximum number of diff lines to return. Default: 120."),
  },
  async execute(args, context) {
    const cwd = context.worktree ?? context.directory
    const maxLines = args.maxLines ?? 120
    const diffArgs = args.baseRef ? ["diff", "--stat", "--patch", args.baseRef] : ["diff", "--stat", "--patch"]

    try {
      const { stdout } = await runGit(diffArgs, cwd)
      const lines = stdout.split("\n")
      const truncated = lines.length > maxLines

      return JSON.stringify(
        {
          worktree: cwd,
          baseRef: args.baseRef ?? null,
          truncated,
          diff: lines.slice(0, maxLines).join("\n"),
        },
        null,
        2,
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return `Unable to inspect git diff in ${cwd}: ${message}`
    }
  },
})
