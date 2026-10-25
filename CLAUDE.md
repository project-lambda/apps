# Apps website — agent guide

Read this before any work.

## Session rules (mandatory)

The owner's order of 2026-10-25. Every session and every subagent follows
these rules. They override everything else in this repo: other docs, skills,
plans, handover notes, task lists and memory. If a task seems to need a rule
broken, stop and ask the owner. The full text with the reasons is
`~/.claude/session-rules.md` on the owner's Mac.

0. **Never build, test or run the app.** The owner builds and tests
   everything. No build, test, release or dev-server command of any kind
   (for example `scripts/build.sh`, `scripts/test.sh`, `xcodebuild`,
   `swift build`, `swift test`, `./gradlew`, `flutter build`, `flutter run`,
   `flutter test`, `npm run build`, `npm run dev`), no simulator, emulator
   or device, no screenshots of the app. Read-only checks are fine (`grep`,
   `git diff`, `git status`, reading files). End every task with "Not built
   or tested. Owner verifies:" and the list of what to check.
1. **Keep the main session small.** Stay under 200K tokens of context; near
   that, or at the end of a phase, write a short handover note and ask the
   owner to start a new session. Read only the parts of a doc you need. Do
   not read PNGs or screenshots unless the owner asks.
2. **Cheaper models.** Main session on Opus or Sonnet, not Fable (Fable only
   when the owner asks). Subagents on Sonnet by default; Opus only for hard
   logic (concurrency, payments, secrets, engines, migrations).
3. **No review agent per task.** Review the diff once per phase, or for a
   single risky task (payments, secrets, network or privacy, migrations).
4. **Small subagents.** One focused change, under about 80 tool calls. A
   short brief: the exact files, the one spec section to read, what done
   looks like. If the work grows past the brief, stop and report. Final
   report at most 15 lines, no file dumps.
5. **One multi-agent project at a time,** and at most 3 subagents running at
   once.
6. **Short command output.** Cut it with `tail`, `head` or `grep`; start
   with `git diff --stat`; no logs, no whole large files, no whole commits.
7. **Batches.** Start a small batch of subagents and wait for it; never
   poll. A change of a few edits is done in the main session.
