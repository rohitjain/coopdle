# coop-game

A daily two-player co-op puzzle game (placeholder name). One player is the
**Solver** and sees the puzzle modules. The other is the **Instructor** and
reads from a text manual. Players coordinate over a voice call — the app
does not handle audio.

Both devices independently generate today's puzzle from a shared date-based
seed, so no realtime sync is needed between them.

## Stack

- Vite + React + TypeScript
- React Router (`/`, `/instructor`, `/solver`)
- Plain CSS (custom game aesthetic, no UI framework)

## Dev

```sh
npm install
npm run dev
```

Open http://localhost:5173 — pick a role from the landing page.

## Status

Scaffolding only. No modules or game logic yet. Routes render placeholder
content.
