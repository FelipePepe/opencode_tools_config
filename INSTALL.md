# Installation Guide

This repository contains an OpenCode configuration file plus custom global tools for OpenCode.

## What gets installed

- `opencode.json`
- `tools/git.ts`
- `tools/github.ts`
- `tools/browser.ts`

## Where to install it

OpenCode loads global configuration from:

- `~/.config/opencode/opencode.json`
- `~/.config/opencode/tools/`

That means:

- `opencode.json` from this repo should be copied or merged into `~/.config/opencode/opencode.json`
- files under `tools/` should be copied into `~/.config/opencode/tools/`

Final layout:

```txt
~/.config/opencode/
  opencode.json
  tools/
    git.ts
    github.ts
    browser.ts
```

## Requirements

- OpenCode installed
- Ollama reachable through an OpenAI-compatible endpoint
- Node.js available
- `gh` installed and authenticated for GitHub tools
- `playwright` installed for browser screenshots

## Install steps

1. Create the tools directory if it does not exist:

```bash
mkdir -p ~/.config/opencode/tools
```

2. Copy the tool files:

```bash
cp tools/*.ts ~/.config/opencode/tools/
```

3. Copy or merge the config file:

```bash
cp opencode.json ~/.config/opencode/opencode.json
```

If you already have an existing OpenCode config, merge this repository's settings into it instead of overwriting it.

## Model configuration

This setup defines these model aliases:

- `ollama-local/qwen-coding` -> `qwen3.6:27b`
- `ollama-local/gemma-vision` -> `gemma4:31b`
- `ollama-local/qwen-uncensored` -> `fredrezones55/Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive:latest`

Default model:

- `model`: `ollama-local/qwen-coding`
- `small_model`: `ollama-local/qwen-coding`

## Included tools

After restarting OpenCode, these custom tools should be available:

- `git_status`
- `git_diff_summary`
- `github_pr_list`
- `github_pr_current`
- `browser`

## Notes

- `github.ts` depends on `gh` being authenticated.
- `browser.ts` depends on the `playwright` CLI being installed.
- `opencode.json` currently contains machine-specific paths for `engram` and `skills`. Adjust those paths if you install this on another machine.

## Reload

Restart OpenCode or open a new session after copying the files so the config and tools are reloaded.
