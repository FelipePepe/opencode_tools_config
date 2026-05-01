import { execFile } from "node:child_process"
import { mkdir } from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"
import { tool } from "@opencode-ai/plugin"

const execFileAsync = promisify(execFile)

export default tool({
  description: "Capture a screenshot of a web page using Playwright and save it under /tmp for later inspection.",
  args: {
    url: tool.schema.string().url().describe("The page URL to capture."),
    name: tool.schema
      .string()
      .optional()
      .describe("Optional file name without path. Default: page-<timestamp>.png"),
  },
  async execute(args) {
    const dir = "/tmp/opencode-playwright"
    const baseName = (args.name ?? `page-${Date.now()}.png`).replace(/[^a-zA-Z0-9._-]/g, "_")
    const filename = baseName.endsWith(".png") ? baseName : `${baseName}.png`
    const outputPath = path.join(dir, filename)

    try {
      await mkdir(dir, { recursive: true })
      await execFileAsync("playwright", ["screenshot", "--full-page", args.url, outputPath], {
        encoding: "utf8",
        maxBuffer: 1024 * 1024,
      })

      return JSON.stringify(
        {
          url: args.url,
          screenshot: outputPath,
        },
        null,
        2,
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return `Unable to capture ${args.url} with Playwright: ${message}`
    }
  },
})
