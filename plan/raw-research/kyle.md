# Kyle's Tech Warmup II Research

## 1. PRD-Driven Development ("Ralph" Workflow)

Ralph is the pattern I use for any feature that takes more than one context window. A PRD is a JSON file listing discrete items; an orchestrator (HEAD Claude) picks the next incomplete item and spawns a worker subagent to execute it.

### Why it maps to the assignment
The assignment explicitly requires `ai-plan.md` and `ai-use-log`. A PRD *is* `ai-plan.md` in executable form. The orchestrator log *is* `ai-use-log` — and it's structured, which means it's easy to grade.

### PRD item shape (from my production repos)
```json
{
  "id": "reel-animation",
  "description": "Implement 3-reel spin animation with easing and stopping sequence",
  "category": "functional",
  "priority": "high",
  "executionMode": "auto",
  "passes": false,
  "steps": ["...concrete file-level work..."]
}
```

Fields that matter:
- **`id`** — stable slug used in commit messages: `[PRD:slot_machine] reel-animation: implement spin`
- **`passes`** — the orchestrator picks the first `passes: false` item by priority
- **`category` / `priority`** — drive ordering (architectural > integration > functional > ui > polish)
- **`executionMode`** — `"subagent"` (default) | `"team"` (research first) | `"auto"` (infer)
- **`steps`** — concrete file-level work. If steps touch >5 files, the inference heuristic kicks up to `team` mode.

### Item sizing rule (the load-bearing constraint)
**Each item = one context window of work, 1-3 files max.** If you can't fit it, split it. This is what makes fresh-context workers viable — they don't need to understand the rest of the project, just their slice.

### Commit discipline
- One commit per item, hash recorded in the progress doc
- Format: `[PRD:{slug}] {item-id}: {description}`
- The HUMAN commits (or the orchestrator commits on the human's behalf in explicit cases). The worker never commits unsupervised. **This maps directly to the assignment rule "you commit, not the agent."**

### Subagent verification — the non-negotiable final step
**Every Ralph subagent's job doesn't end when the code is written — it ends when the code is verified.** After writing code, before marking `passes: true`, the subagent must:

1. Re-read the files it just wrote (confirm what's actually on disk, not what it *thinks* it wrote)
2. Run the feedback loop (typecheck / lint / test / e2e — see §5)
3. For UI items, take a Playwright screenshot and confirm the expected state
4. Record the exact output/hash as evidence in the progress doc

If any step fails, the subagent fixes it *in the same spawn* and re-verifies. It does not hand back a "I wrote the code, probably works" completion. **Write → verify → claim** is one atomic unit. This is the single biggest quality lever — most agent failures aren't bad code, they're unverified code.

---

## 2. Subagent Workflows — Fresh Context Per Item

The core insight behind Ralph: **never let context accumulate across work items**. Every worker spawn gets a blank slate plus its specific item prompt.

### Why this matters for software quality
After ~30-50K tokens in a single session, agents start:
- Forgetting earlier decisions
- Re-litigating settled choices
- Inventing files that don't exist
- Confabulating function signatures

Fresh-context workers avoid all of this. They read only what they need, do the work, commit, exit. The orchestrator (HEAD) keeps a high-level view but doesn't carry the line-by-line details of every prior item.

### Team workflow — research agents for complex items

For items that touch multiple layers or files, I spawn a **research team** instead of a single worker:

| Agent | Model | Role |
|---|---|---|
| `codebase-researcher` | Sonnet | Traces blast radius via LSP: who calls this, who imports this, what breaks if I change it |
| `pattern-finder` | Haiku | Scans for similar implementations and reusable abstractions |
| `edge-case-hunter` | Sonnet | Enumerates failure modes, race conditions, null paths, state conflicts |
| `devils-advocate` | Sonnet | Adversarially challenges the proposed approach — finds holes, counter-proposals |

They run **in parallel**, synthesize findings, then a separate implementation teammate executes with the synthesized context. This maps to the assignment's expectation of "domain and user-focused thinking" — the research step is where that thinking happens, before code is written.

### Inference heuristic (auto-assign subagent vs team)
```
if item.executionMode != 'auto': use as-is
elif >5 distinct file paths in steps: team
elif priority=='high' AND category=='architectural': team
elif files span 2+ layers (frontend/shared/edge/data): team
else: subagent
```

### For the slot machine
- Reel spin mechanics → `subagent` (1-2 files, UI-isolated)
- Payout/RNG engine + UI wiring + persistence → `team` (architectural, cross-layer)
- CSS polish → `subagent`
- First-run onboarding flow + state + i18n → `team`

---

## 3. Progress Documents — The Graded Artifact

The progress doc is **the single most important output** of an AI-assisted run, because it's what the TAs read. My format, per item:

```markdown
## Item: {id}
> {description}
> Priority: {p} | Category: {c}

### Step 1: Understand
- Current behavior: ...
- Evidence: {file}:{line}

### Step 2: Plan
- Proposed change: ...
- Risk assessment: low/medium/high + why
- Evidence: followed {existing pattern} from {file}

### Step 3: Implement
- Changes made: bulleted diff summary
- Evidence: {file}:{line-range}

### Step 4: Verify
- Syntax: PASS/FAIL (command run)
- Tests: PASS/FAIL (command run)
- Manual: what was visually confirmed
- Evidence: command output

### Step 5: Commit
- Hash: {short-sha}
- Unexpected: anything that surprised you
```

This maps **1:1** to the assignment's "document what you do + what you learn as you go forward" rule. When we hit a bug, we don't delete the failed approach — we log it in Step 3 as "tried X, failed because Y" and keep going. TAs explicitly want to see learning, not a sanitized win.

---

## 4. Global `~/.claude/CLAUDE.md` — Standing Orders

Harness-level rules that apply to every session, shared across all teammates via the repo's `CLAUDE.md`. The ones that have materially improved my output quality:

### Quality gates (ban shallow claims)
- **Verification before completion**: no claims without evidence. Ban `SHOULD/PROBABLY/SEEMS TO`. Gate: IDENTIFY → RUN → READ → VERIFY → CLAIM.
- **Diff budget**: one work unit produces <150 lines of diff. Exceed → split.
- **File read chunking**: files >500 LOC must be read with offset/limit; explicit flag when read may be partial.
- **Visual verification**: UI changes require Playwright screenshot + "confirm expected state matches what you see" before marking complete.

### Search discipline
- **Never use built-in Grep/Glob/WebSearch directly** — wrappers (Serena LSP for code navigation, `mgrep` for text) surface better results and centralize permissions.
- **Rename safety**: on any symbol rename, search 6 places separately — direct refs, type refs, string literals, dynamic imports, re-exports, test mocks. Never assume one search caught it all.

### Code style guardrails
- **Step 0 rule** — before any task touching >3 files, strip dead props / unused exports / orphaned imports as a separate commit. Starts the real work with a clean token budget.
- **Swarming threshold** — tasks touching >5 independent files MUST use parallel subagents (5-8 files per agent). Sequential processing is forbidden for large tasks.
- **Don't add docstrings/comments to unchanged code.**
- **Senior dev standard** — if architecture is flawed, state is duplicated, or patterns inconsistent, propose and implement structural fixes, not band-aids.

These are enforceable because they're **in the harness file**, not the prompt. Agents read them every session.

---

## 5. Feedback Loop — What "Done" Looks Like

For the slot machine, I'd define a tight feedback loop before any AI writes code:

```
1. npm run typecheck  → zero errors
2. npm run lint       → zero errors (HTML-validate, CSS, JS style)
3. npm run test       → unit tests pass
4. npx playwright test → e2e pass
5. Visual verification → Playwright screenshot matches design
```

The agent doesn't get to claim an item is done until all 5 pass. The orchestrator **re-runs the loop** after each commit. If step 3 fails, the item flips back to `passes: false` and a new worker gets spawned to fix it (with the test failure as prompt context).

This maps directly to the assignment's "Linted / Documented / Tested / Clean" requirements. The loop is the enforcement mechanism.

---

## 6. Harness & Model Choice Recommendation

The assignment says: *"You must always use the same harness you start with. Explain your rationale for which model you use within your agent."*

### Recommended harness: **Claude Code**
Reason: mature subagent spawning (Agent tool), native Playwright MCP integration (required for visual verification gate), settings.json hooks for automated post-commit runs, and the PRD workflow is battle-tested on it.

### Model strategy
- **Orchestrator (HEAD) — Opus** — picks items, synthesizes research team findings, makes architectural judgment calls, talks to the human. Gets the expensive thinking because the cost is amortized across all items.
- **Workers — Sonnet (default)** — implement items. Sonnet is good enough for 1-3 file changes with clear steps, ~5x cheaper per token.
- **Research agents — mostly Sonnet, pattern-finder Haiku** — parallelism makes total wall-clock cheap; pattern scanning is shallow enough for Haiku.

### Failure mode to avoid
Don't switch models mid-run ("this item I'll use Opus"). The assignment rule is explicit and it also screws up reproducibility. Lock the matrix once, document it in `ai-plan.md`, log any change in `ai-use-log` with reason.

---

## 7. Key Risks I'd Flag to the Team Tonight

1. **Context starvation in the orchestrator**. If HEAD tries to hold every item's detail, it will forget early ones. Fix: aggressive use of the progress doc as external memory — HEAD re-reads it before picking the next item, doesn't rely on its own context.
2. **Agent commits**. The assignment is explicit: "Do not prompt the agent to commit on your behalf." This is easy to violate accidentally when you let Claude Code run autonomously. Need a hard rule in `ai-plan.md`: humans only stage + commit.
3. **Hand-editing creep**. Rule: agent tries first, fails, *then* hand-edit, *then* log the hand-edit with reason. Easy to skip the "log" step. Include a checklist in the progress-doc template.
4. **"Done" theater**. Agents will claim items complete that fail the feedback loop. Fix: the verification gate (§5) + the subagent write→verify→claim rule (§1) are non-negotiable. Lint/typecheck/test must run and pass before `passes: true`.
