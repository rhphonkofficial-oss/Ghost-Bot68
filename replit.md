# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Also contains Ghost Bot — a Facebook Messenger bot customized for Rakib Islam.

## Ghost Bot

Located in `/ghost-bot/` — Facebook Messenger bot based on GoatBot V2, fully customized.

- **Bot Name**: Ghost Bot
- **Owner**: Rakib Islam (UID: 61576396811594)
- **Prefix**: . (dot)
- **Commands**: 182+ (175 original + 7 Ghost exclusive)

### Ghost Bot Exclusive Commands
- `owner.js` — Owner info card with Facebook profile photo
- `alive.js` — Bot alive status
- `ghostinfo.js` — Bot details & uptime
- `ghostping.js` — Bot ping/speed check
- `ghostquote.js` — Random dark quotes
- `ghostask.js` — AI question answering
- `ghosthelp.js` — Custom help menu
- `ghostwelcome.js` — Welcome message toggle

### To run Ghost Bot
```
cd ghost-bot
npm install
node index.js
```
Add Facebook cookie to `account.txt` first.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
