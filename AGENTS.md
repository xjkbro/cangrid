## Commit policy

Do not run `git commit`, `git push`, or `gh pr create` unless the user explicitly asks for it in that turn. Prepare, describe, and let the user review changes first; a prior approval to commit does not carry over to later work.

## Agent skills

### Issue tracker

Issues tracked via GitHub Issues (`xjkbro/cangrid`), using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical labels used as-is (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
