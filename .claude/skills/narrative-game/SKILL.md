---
name: narrative-game
description: Use to create a brand new clicker/narrative game (a new app in apps/<gameId>/) or to extend an existing one by mapping a narrative outline ("trame narrative") onto resources, actions, upgrades, quests, story nodes, theme tokens, and i18n keys. TRIGGER when the user provides a story outline / chapter list / arc and asks to scaffold or expand a game. SKIP for non-narrative changes (engine bug fixes, UI tweaks, dependency upgrades).
---

# Narrative Game Authoring

This repo is a pnpm monorepo built around a reusable, content-driven engine
(`packages/engine`). Each game lives at `apps/<gameId>/` and is defined entirely
through a `GameDefinition` object. This skill turns a narrative outline into
a working `GameDefinition` plus i18n files.

## Required inputs (ask the user if missing)

Before writing anything, you MUST have:

1. **Game id** (kebab-case, e.g. `golden-tide`). Used as folder name and `meta.id`.
2. **Mode**: `create` (new app) or `extend` (modify an existing `apps/<id>/`).
3. **Narrative outline** — the trame. Acceptable forms:
   - A list of chapters/beats with the order they unlock
   - A short synopsis the user wants you to expand into beats
   - Existing partial files to weave new content into
4. **Theme direction** (optional): mood / palette hints. Default to neutral if absent.
5. **Locales**: confirm `fr` is the reference. Add `en` stubs unless the user opts out.

If anything in 1–3 is unclear, use `AskUserQuestion` BEFORE editing files. Don't
guess the trame — narrative content is the one thing that must come from the user.

## Workflow

### 1. Anchor on existing patterns

Read the reference implementation before writing anything new:

- `apps/hello-world/src/game/index.ts` — how a `GameDefinition` is composed
- `apps/hello-world/src/game/{resources,actions,upgrades,quests,story,theme}.ts`
- `apps/hello-world/src/game/i18n/{fr,en,index}.ts`
- `apps/hello-world/package.json` — deps and scripts to mirror
- `apps/hello-world/vite.config.ts` — PWA + manifest (lang and theme color come from the new game's theme/locale)
- `apps/hello-world/tsconfig.json`, `apps/hello-world/index.html`, `apps/hello-world/src/main.tsx`, `apps/hello-world/src/GameRoot.tsx`

Read the engine surface so you use the right primitives:

- `packages/engine/src/types/index.ts` (re-exports everything)
- `packages/engine/src/types/condition.ts` — Condition DSL
- `packages/engine/src/types/effect.ts` — Effect DSL
- `packages/engine/src/types/modifier.ts` — Modifier targets
- `packages/engine/src/validate.ts` — what the validator checks

### 2. Translate the trame into engine primitives

For each narrative beat in order, decide which engine entities express it.
The mapping is almost always one of these patterns — keep it boring and predictable:

| Narrative element                              | Engine primitive |
|------------------------------------------------|------------------|
| Player gains a new currency / vibe / stat      | `ResourceDefinition` (often gated by `visibleWhen`) |
| A new gesture the player can perform           | `ActionDefinition` (`yield`/`cost`/`visibleWhen`) |
| A power-up that reshapes the loop              | `UpgradeDefinition` whose `effects` include `addModifier` |
| An objective the player works toward           | `QuestDefinition` (`completeWhen`, `rewards`) |
| A story moment / line of prose                 | `StoryNodeDefinition` (`triggerWhen`, optional `effects` to advance state) |
| A permanent flag set by an event               | `Effect: setFlag` inside a quest reward or story node |
| A second-act or third-act unlock               | A Condition: `and` of `storyNodeSeen` + resource thresholds + flags |

Rules of thumb:

- The story is **driven by conditions**, not a graph. Each `StoryNodeDefinition`
  has a `triggerWhen` and fires once. Use `storyNodeSeen` in subsequent nodes'
  `triggerWhen` to chain a linear arc.
- Use `flagEquals` for one-shot signals from quests/story (e.g. `'metStranger'`).
- Use `addModifier` (with a unique `sourceId`) for permanent buffs from upgrades —
  never mutate base values. This keeps refunds/reworks trivial.
- Numbers can be huge: pass them as strings (`'1e15'`) or numbers; the engine
  normalizes via `toDecimal`.
- **Always** include a `LocalizedKey` for every user-facing field, never literal text.

### 3. i18n keys: convention

Every user-facing string field (`Resource.name/description`, `Action.label/description`,
`Upgrade.name/description`, `Quest.name/description`, `StoryNode.body`) is a
`LocalizedKey`. Use this naming scheme strictly:

- `game:resource.<id>.name`, `game:resource.<id>.description`
- `game:action.<id>.label`, `game:action.<id>.description`
- `game:upgrade.<id>.name`, `game:upgrade.<id>.description`
- `game:quest.<id>.name`, `game:quest.<id>.description`
- `game:story.<id>.body`
- `ui:*` keys for chrome (mirror `apps/hello-world/src/game/i18n/fr.ts`)

The `fr.ts` dictionary is the **reference**: it MUST contain every key referenced
by the GameDefinition. `en.ts` is a stub — missing keys fall back to `fr`. The
validator (`validateGameDefinition`) and the i18n test will fail if a key is
missing in the reference locale.

### 4. Theme

Pick a palette consistent with the trame's mood. Define all 8 colors, 3 fonts,
3 radii, 5 spacing tokens (see `apps/hello-world/src/game/theme.ts`). Update the
manifest's `background_color` and `theme_color` in `apps/<gameId>/vite.config.ts`
to match.

### 5. Files to create or update (per game)

For `create` mode, scaffold the full app by mirroring `apps/hello-world` exactly,
substituting `<gameId>` and the new content. Required files:

```
apps/<gameId>/
  package.json                  # name = "<gameId>", same deps
  tsconfig.json                 # copy as-is
  vite.config.ts                # update manifest name/lang/theme_color/short_name
  index.html                    # update <title> and <html lang>
  public/icons/                 # copy placeholders or real icons
  src/
    main.tsx                    # imports `./game/index.js`
    GameRoot.tsx                # copy as-is from hello-world
    state/{store,context,hooks}.ts   # copy as-is
    i18n/setup.ts                    # copy as-is
    test/setup.ts                    # copy as-is
    ui/*.tsx + *.module.css          # copy as-is unless the trame demands custom UI
    game/
      index.ts                  # composes the GameDefinition
      resources.ts
      actions.ts
      upgrades.ts
      quests.ts
      story.ts
      theme.ts
      i18n/{fr,en,index}.ts
    __tests__/
      i18n.test.ts              # mirror hello-world (validates key coverage)
      <gameId>.e2e.test.ts      # walks at least one chapter end-to-end
```

For `extend` mode, only touch the `src/game/**` files (and possibly `theme.ts`
+ vite manifest). Don't rewrite store/UI unless the user explicitly asks.

### 6. Tests are the contract

For every new beat, add to the e2e test a sequence that proves it triggers:
seed initial state, simulate clicks/ticks, assert the expected story node was
seen and the expected quest completed. Pattern follows
`apps/hello-world/src/__tests__/helloWorld.e2e.test.ts`.

The i18n test is identical in shape across games — copy and adapt the import.

### 7. Validate before declaring done

Run, in order, and fix anything that breaks:

```bash
pnpm install                                    # only if you added a new app folder
pnpm --filter <gameId> typecheck
pnpm --filter <gameId> test
pnpm --filter <gameId> build                    # confirms PWA assembles
```

If `validateGameDefinition` errors mention "missing translation key", the
reference locale `fr.ts` is incomplete — add the missing keys, don't loosen
the validator.

### 8. End-of-task summary

Tell the user, briefly:
- Which beats from their trame mapped to which entities (table form)
- Any narrative ambiguities you resolved (and what you assumed)
- The exact commands to play it (`pnpm --filter <gameId> dev`)

## Anti-patterns to refuse

- Storing user-facing text directly on a `GameDefinition` field (always use a `LocalizedKey`).
- Mutating engine internals from a game module (the engine is a black box).
- Adding new fields to `GameDefinition`/`GameState` to fit a beat — extend the
  engine in `packages/engine` separately, with tests, before the game uses it.
- Skipping the i18n test or relaxing `validateGameDefinition`.
- Inventing condition or effect kinds — only the discriminated-union variants
  declared in `packages/engine/src/types/{condition,effect}.ts` exist.
- Copy-pasting `hello-world`'s narrative content. Start from the user's trame.

## Quick checklist (use as you go)

- [ ] Confirmed game id, mode, trame, theme, locales
- [ ] Mapped each beat to an engine primitive
- [ ] All user-facing fields are `LocalizedKey`s following the naming convention
- [ ] Every key exists in `fr.ts` (reference)
- [ ] `en.ts` stub provided (or user explicitly opted out)
- [ ] Theme tokens cover all 8 colors / 3 fonts / 3 radii / 5 spacings
- [ ] Manifest in `vite.config.ts` updated (name, lang, theme_color, background_color)
- [ ] e2e test covers at least one full chapter loop
- [ ] `typecheck`, `test`, `build` all green for `apps/<gameId>`
