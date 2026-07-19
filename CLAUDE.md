# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`shortcut-api` is an object-oriented Node.js/TypeScript client for the Shortcut (formerly Clubhouse) REST API. It is published to npm and consumed as a library — `src/index.ts` is the public surface, so changes to exported names/shapes are breaking changes for downstream consumers.

## Commands

Package manager is Yarn (`packageManager` pinned in package.json; CI uses `yarn install --immutable`).

- `yarn test` / `npm test` — run the full Jest suite (coverage collection is on by default via `jest.config.js`)
- `npx jest tests/epics/epic.test.ts` — run a single test file
- `npx jest -t "returns an array of objectives"` — run tests matching a name
- `npm run lint` — ESLint over `src` and `tests`
- `npm run lint:fix` — same, with autofix
- `npm run build` — full dual-target build (cleans `dist/`, compiles ESM and CJS, rewrites path aliases, renames output to `.mjs`/`.cjs`, and fixes up import/require extensions)
- `npm run docs` — generates TypeDoc output into `docs/`

There is no separate typecheck script; `tsc` runs as part of `npm run build` (`compile:esm` / `compile:cjs`).

## Architecture

### Resource / Service / Contract triad

Every Shortcut entity (Story, Epic, Iteration, Member, Team, Label, Workflow, Objective, KeyResult, LinkedFile, CustomField, UploadedFile, Repository, ...) lives in its own directory under `src/` and follows the same three-part pattern:

- **Resource** (e.g. `src/epics/epic.ts`) — a class extending `BaseResource<Interface>` that implements the entity's `*Interface`. Holds instance data and relationship getters (e.g. `epic.teams`, `epic.owners`) that lazily construct a service and fetch related resources.
- **Service** (e.g. `src/epics/epics-service.ts`) — a class extending `BaseService`/`BaseSearchableService` that performs the actual HTTP calls (`get`, `list`, `search`) and turns raw API JSON into Resource instances via a `factory` function.
- **Contracts** (`contracts/` subdirectory) — paired interfaces per entity:
  - `*-api-data.ts` — shape of the raw JSON from the Shortcut API, snake_case fields (extends `BaseData`)
  - `*-interface.ts` — the JS/TS-facing shape, camelCase fields (extends `BaseInterface`)
  - `create-*-data.ts` — subset of fields accepted when creating a new resource

Resource and service classes are near-mechanical duplicates of these interfaces (field lists must be kept in sync manually across `*-api-data.ts`, `*-interface.ts`, and the resource class body). When adding a new entity or field, update all three.

### Base classes (`src/base-*.ts`)

- `BaseResource` — abstract base for every resource. Instances are wrapped in a `Proxy` that records every property write into `changedFields`. `save()` dispatches to `create()` (POST, using only fields listed in `createFields`) or `update()` (PUT, using only `changedFields`) based on whether `id` is set. `delete()` issues a DELETE. Each subclass must declare `availableOperations` (`'update' | 'create' | 'delete' | 'comment'`); calling an operation not in that list throws. Subclasses must also override the static `baseUrl` getter.
- `BaseService` — generic `get`/`getMany`/`list` against `baseUrl`, gated by the service's own `availableOperations` (`'get' | 'search' | 'list'`). Caches fetched instances by id in `this.instances`.
- `BaseSearchableService` — extends `BaseService` with `search(query, next?)`, hitting Shortcut's dedicated `/search/<resource>` endpoint and returning a `SearchResponse` (supports `hasNextPage` / `next()` pagination).
- Not every entity supports every operation — check the existing `availableOperations` array on a sibling resource/service before assuming `create`/`delete`/`search` exist for a given entity.

### Field name conversion

The API uses snake_case, the library's public interfaces use camelCase. `src/utils/convert-fields.ts` (`convertApiFields` / `convertToApiFields`) does the recursive key conversion in both directions and also parses ISO datetime-shaped strings into `Date` objects on the way in (via `isValidDatetimeFormat`). `camel-to-snake.ts` / `snake-to-camel.ts` are the underlying string converters. Any new code that talks to the API should route data through these rather than hand-rolling conversion.

### Client entry point

`src/client.ts`'s `Client` class is the SDK entry point: it instantiates one service per entity and exposes them as properties (`client.stories`, `client.epics`, ...). It resolves the API key from a constructor arg or `SHORTCUT_API_KEY`; `src/utils/headers.ts#getHeaders()` is the equivalent lookup used inside resource/service methods that aren't handed headers directly.

### Bundle

`src/bundle.ts`'s `Bundle<R>` lets callers batch-update many resource instances at once (from ids or existing instances) through the same Proxy/`changedFields` mechanism as `BaseResource`, propagating a single field change to every wrapped resource on `update()`.

### Error handling

HTTP failures from `axios` go through `src/utils/handle-response-failure.ts#handleResponseFailure`, which logs details and returns `undefined`/`void` rather than throwing — callers check for a falsy response and throw their own `Error` at the call site (see `BaseResource.update`/`delete`, `Epic.comment`).

### Path alias

`@sx/*` maps to `./src/*` (defined in `tsconfig.base.json`, mirrored in `jest.config.js` `moduleNameMapper`, and rewritten to relative paths at build time via `tscpaths` in the `replace-paths` build step). Always import via `@sx/...` inside `src/`; tests use `@sx/...` too, though some reach into `../../src/...` directly (either style appears — prefer `@sx/...` for new tests).

### Dual ESM/CJS build

The library ships both module formats from one `src/` tree: `tsconfig.esm.json` and `tsconfig.cjs.json` (both extending `tsconfig.base.json`) compile to `dist/esm` and `dist/cjs` respectively, `renamer` retargets extensions to `.mjs`/`.cjs`, and `scripts/reformat-esm-imports.js` / `scripts/reformat-cjs-imports.js` patch import/require specifiers to include the new extensions. Don't hand-edit anything under `dist/` — it's regenerated by `npm run build`.

## Testing conventions

- Test tree under `tests/` mirrors `src/` layout, files named `*.test.ts` (one legacy `*.test.js`).
- `tests/setup.ts` (via `jest.config.js` `setupFilesAfterEnv`) sets `SHORTCUT_API_KEY=token` for all tests and silences `console.log`/`error`/`warn`.
- `axios` is manually mocked per test file (`jest.mock('axios', () => ({ get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() }))`) rather than using `axios-mock-adapter` in most newer tests — follow the existing pattern in the file you're editing.
- Coverage is uploaded to Codecov in CI; there's no enforced local coverage threshold in `jest.config.js`.

## Lint

ESLint uses flat config (`eslint.config.mjs`) built on `eslint-config-yenz`, with two local overrides worth knowing about:
- `@typescript-eslint/no-unnecessary-condition` is off — resource classes are populated via `Object.assign` from API JSON at runtime even though fields are typed non-optional, so defensive null/undefined checks that look "unnecessary" to the type checker are often load-bearing.
- `import/order` is redefined (not merged) to keep the `@sx/*` alias grouped as `internal` rather than `external`, alphabetized with blank lines between groups.
- `no-magic-numbers` is disabled for test files.

## CI

- `tests.js.yml` runs the Jest suite across Node 22/24/26 on pushes to `develop` and on PRs touching `src/`, `tests/`, `.github/`, or `package.json`.
- `lint.yml` runs ESLint on changed files for the same triggers.
- `docs.yml` regenerates and publishes TypeDoc to GitHub Pages on push to `main`.
- `reviewer.yml` runs an automated AI PR reviewer on PR open/sync.
