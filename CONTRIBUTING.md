# Contributing to westures

Thanks for contributing to westures. Contributions to the gesture library,
tests, documentation, and examples are welcome.

## Development setup

This project uses npm and is [tested in CI](./.github/workflows/node.js.yml)
across a matrix of recent Node versions.

Install dependencies with:

```sh
npm clean-install
```

The gesture engine is included as the `core` submodule. Initialize it after
cloning with:

```sh
git submodule update --init --recursive
```

## Common commands

Run the same checks used by CI before opening a pull request:

```sh
npm run build
npm run lint
npm test
npm run test:coverage
```

Additional useful commands:

```sh
npm run build:debug
npm run lint:fix
npm run docs
```

## Development workflow

- Keep changes focused and update tests when behavior changes.
- Update `CHANGELOG.md` for notable user-facing, maintenance, or security
  changes.
- Regenerate the tracked `docs/` output with `npm run docs` when public JSDoc
  changes.
- Update the `core` submodule deliberately when a change depends on
  westures-core.
- Open a pull request using the repository's pull request template.

The gesture implementations are in `src/`, tests are in `test/`, and
`index.js` is the package entry point. The `dist/` directory contains build
output; regenerate it with `npm run build` rather than editing it directly.

Follow the existing JavaScript style. ESLint enforces the project conventions.

## Pull requests

Before opening a pull request, run the build, linter, and relevant tests. Give
the pull request a clear description, explain any behavioral changes, and use
the provided pull request template to identify its type. Keep unrelated
formatting or refactoring changes out of the pull request.

For bugs, include a regression test when practical. For user-facing API or
behavior changes, update the README and JSDoc documentation as appropriate.

## Release process

For a package release, publish from the merged `main` commit so the package
and release tag refer to the same source.

1. Create a release preparation branch from `main`.
2. Update `package.json`, `package-lock.json`, `CHANGELOG.md`, and the `core`
   submodule reference when needed.
3. Regenerate the distribution and documentation with `npm run build` and
   `npm run docs`.
4. Commit the release preparation changes and open a pull request.
5. Merge the pull request into `main`.
6. Check out the merged `main` commit locally and verify the working tree is
   clean.
7. Create the release tag locally for that commit, but do not push it yet.
8. Check what will be published with `npm pack --dry-run`.
9. Sanity-check the built bundle in `dist/index.js`.
10. Publish the package to npm.
11. Push the tag.
12. Create the GitHub release from the pushed tag.
