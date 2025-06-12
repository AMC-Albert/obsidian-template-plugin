# Template Plugin Improvement Task List

**Date:** 2025-06-12

This file outlines actionable recommendations to modernize, document, and streamline maintenance of the Obsidian template plugin, with an emphasis on best practices, LLM-friendly code, and developer experience.

---

## 1. Documentation

- [ ] **README Refresh**: Rewrite `README.md` to:
	- Reflect current usage of `obsidian-logger` in `utils/obsidian-logger`.
	- Provide clear installation, configuration, and activation steps.
	- Include code snippets for common templates and event hooks.
- [ ] **Usage Examples**: Add a `/docs/examples/` folder containing sample vault templates and JSON configuration.
- [ ] **Change Log**: Maintain a `CHANGELOG.md` tracking feature additions, bug fixes, and breaking changes.

## 2. Code Quality & Style

- [x] **Consistent Formatting**:
	- Enforce tabs for indentation via ESLint/Prettier config.
	- Enable optional chaining (`?.`) and nullish coalescing (`??`) in TS rules.
- [x] **TypeScript Strictness**:
	- Turn on `strict` mode in `tsconfig.json`.
	- Address all `noImplicitAny` and `strictNullChecks` errors.
- [ ] **Modular Structure**:
	- Group related code under clear subfolders (e.g., `commands/`, `views/`).
	- Ensure each folder has an `index.ts` exporting public APIs.

## 3. Dependency & Build Management

- [x] **Upgrade `obsidian-logger`**:
	- Bump to latest version and adjust imports.
- [x] **Lockfile & Versioning**:
	- Commit `package-lock.json` or `yarn.lock` to repo.
	- Use semantic versioning and update `manifest.json` accordingly.
- [x] **Build Script**:
	- Add `build` and `watch` scripts in `package.json` using ESBuild config.
	- Ensure build outputs to `dist/` and that plugin zip uses trimmed dist.

## 4. Testing & CI

- [ ] **Unit Tests**:
	- Add Jest or Vitest with coverage reporting.
	- Cover core modules: `SettingsManager`, `VaultEventHandler`, template parsing.
- [ ] **Continuous Integration**:
	- Create GitHub Actions or Azure Pipelines config to run lint, typecheck, tests on PRs.
- [ ] **Pre-commit Hooks**:
	- Add `husky` to run `lint-staged`, format and test changed files.

## 5. Developer Experience & LLM-Friendliness

- [ ] **In-Code Documentation**:
	- Add JSDoc/TSDoc comments for public functions, classes, and interfaces.
- [ ] **Semantic Naming**:
	- Use self-descriptive variable and function names (e.g., `applyTemplateToActiveFile`).
- [ ] **Small, Focused Functions**:
	- Refactor large methods into smaller, composable utilities.
- [ ] **Error Handling**:
	- Centralize error logging via `obsidian-logger`, include context metadata.
- [ ] **Type Definitions**:
	- Expose plugin settings and event payload types in `types/index.ts`.

## 6. Packaging & Distribution

- [ ] **Plugin Manifest**:
	- Validate `manifest.json` fields: `id`, `name`, `version`, `minAppVersion`, `author`.
- [ ] **Release Workflow**:
	- Automate GitHub Releases with built assets and changelog entries.
- [ ] **Marketplace Readiness**:
	- Verify license file is present and clearly documented.

---

*End of Task List*
