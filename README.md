# OpenCode Tools Config

OpenCode configuration for local Ollama models and a small set of higher-level tools that work well with local coding models.

## Included

- `opencode.json`: provider and model aliases for Ollama
- `tools/git.ts`: structured git status and diff helpers
- `tools/github.ts`: structured GitHub pull request helpers via `gh`
- `tools/browser.ts`: Playwright screenshot helper

## Models

The default model is `ollama-local/qwen-coding`, backed by `qwen3.6:27b`.

Other configured aliases:

- `ollama-local/gemma-vision` -> `gemma4:31b`
- `ollama-local/qwen-uncensored` -> `fredrezones55/Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive:latest`

## Usage

Copy or merge `opencode.json` into `~/.config/opencode/opencode.json`.

Copy the files in `tools/` into `~/.config/opencode/tools/`.

Restart OpenCode or open a new session so it reloads the configuration.

## Tool Names

OpenCode will expose these tool names:

- `git_status`
- `git_diff_summary`
- `github_pr_list`
- `github_pr_current`
- `browser`

## Requirements

- OpenCode
- Ollama exposed through an OpenAI-compatible endpoint
- `gh` installed and authenticated for GitHub tools
- `playwright` installed for browser screenshots
