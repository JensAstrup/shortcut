# Integration suite

Exercises the library against the real Shortcut API, through its public surface only — `Client`,
services, and resource methods. Nothing here mocks axios; that is the point. The unit suite proves
the code calls what it thinks it calls, this suite proves the API agrees.

## Running

```sh
SHORTCUT_API_KEY=<token> npm run test:integration
```

**These tests create and delete real objects.** Point the token at a scratch workspace, not a
workspace anyone depends on. The suite refuses to run without an explicit `SHORTCUT_API_KEY`, and
deliberately has no default, so it cannot silently pick up an ambient credential.

`npm test` does not run these. They live under `integration/` with their own
`jest.integration.config.js`, while the unit config's `roots` covers only `src/` and `tests/`. The
unit setup file also injects a fake token and silences `console`, both of which would break or hide
real requests.

## What gets created

Every object is named `sdk-integration-test <what> <timestamp>-<random>`. If a run crashes hard,
search that prefix in Shortcut to find and remove leftovers.

Cleanup is registered immediately after each create, not at the end of a test, so an assertion that
fails partway through still leaves a removable trail. Teardown runs newest-first so links and
comments come off before the stories they hang from. Failures during cleanup are warned, not thrown,
so a cleanup problem cannot overwrite the real test result.

Objects touched: stories, story comments, story tasks, story links, epics, epic comments, labels,
iterations. Members and workflows are read-only.

## Notes

- `maxWorkers: 1`. The API is rate limited, and parallel workers make both throttling and
  cross-test interference likelier.
- Search is **not** read-your-writes. The one search test polls; every other assertion is immediate
  and should stay that way.
- `client-isolation.integration.test.ts` covers SAPI-326 — that a `Client` keeps its credential on
  its own axios instance rather than writing it to `process.env`. The unit suite asserts this
  against mocks, which will authenticate anything; only a real request proves the token travels.
