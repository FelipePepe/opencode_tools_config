import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { tool } from "@opencode-ai/plugin"

const execFileAsync = promisify(execFile)

async function runGh(args: string[], cwd: string) {
  return execFileAsync("gh", args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
  })
}

function parseJson(stdout: string) {
  try {
    return JSON.parse(stdout)
  } catch {
    return stdout.trim()
  }
}

export const pr_list = tool({
  description: "List pull requests for the current GitHub repository with structured metadata.",
  args: {
    state: tool.schema
      .enum(["open", "closed", "merged", "all"])
      .optional()
      .describe("Pull request state filter. Default: open."),
    limit: tool.schema
      .number()
      .int()
      .min(1)
      .max(20)
      .optional()
      .describe("Maximum number of pull requests to return. Default: 10."),
  },
  async execute(args, context) {
    const cwd = context.worktree ?? context.directory
    const state = args.state ?? "open"
    const limit = String(args.limit ?? 10)

    try {
      const { stdout } = await runGh(
        [
          "pr",
          "list",
          "--state",
          state,
          "--limit",
          limit,
          "--json",
          "number,title,state,isDraft,headRefName,baseRefName,updatedAt,url,author",
        ],
        cwd,
      )

      return JSON.stringify(
        {
          repository: cwd,
          state,
          items: parseJson(stdout),
        },
        null,
        2,
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return `Unable to list pull requests from ${cwd}: ${message}`
    }
  },
})

export const pr_current = tool({
  description: "Inspect the pull request associated with the current branch in the active GitHub repository.",
  args: {},
  async execute(_args, context) {
    const cwd = context.worktree ?? context.directory

    try {
      const { stdout } = await runGh(
        [
          "pr",
          "view",
          "--json",
          "number,title,state,isDraft,headRefName,baseRefName,updatedAt,url,author,body,mergeable,reviewDecision",
        ],
        cwd,
      )

      return JSON.stringify(parseJson(stdout), null, 2)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return `Unable to inspect the current branch pull request from ${cwd}: ${message}`
    }
  },
})
