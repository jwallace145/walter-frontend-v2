.PHONY: dev format lint lint-check type-check pre-commit-check

help:
	@echo "Common commands:"
	@echo "  make dev                 Start development server"
	@echo "  make format              Format code with Prettier"
	@echo "  make lint                Run ESLint with auto-fix"
	@echo "  make lint-check          Run ESLint without auto-fix (check only)"
	@echo "  make type-check          Run TypeScript type checking"
	@echo "  make pre-commit-check    Run all pre-commit checks manually"

dev:
	npm run dev

format:
	npx prettier --write .

# Run ESLint with auto-fix (matches pre-commit behavior)
lint:
	npx eslint src --ext .js,.jsx,.ts,.tsx --fix --max-warnings=93

# Run ESLint without auto-fix (good for CI/checking)
lint-check:
	npx eslint src --ext .js,.jsx,.ts,.tsx --max-warnings=0

# Run TypeScript type checking
type-check:
	npx tsc --noEmit

# Run all pre-commit checks manually
pre-commit-check: format lint type-check
	@echo "✅ All checks passed! Ready to commit."
