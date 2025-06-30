# Contributing to LeiaGuard

Thank you for taking the time to contribute! 🫶

Below is a lightweight guide for common contribution workflows. If something is unclear or missing, please [open an issue](https://github.com/YOUR_ORG/LeiaGuard/issues/new/choose) so we can improve it.

---

## 🛠 Local development

There are two ways to set up your local development environment:

### Option 1: Using Docker (Recommended)

This is the easiest way to get started as it sets up all dependencies for you.

1.  **Fork** the repository and clone your fork.
2.  Build and run the Docker containers:
    ```bash
    docker-compose up --build
    ```
3.  The application will be available at `http://localhost:3000`.

### Option 2: Manual Setup

1.  **Fork** the repository and clone your fork.
2.  Install dependencies with npm:
    ```bash
    npm install
    ```
3.  Copy `env.example` to `.env.local` and fill in any variables that require real values.
4.  Initialize the database:
    ```bash
    npm run db:push
    npm run db:seed
    ```
5.  Run the app in development mode:
    ```bash
    npm run dev
    ```
6.  Navigate to <http://localhost:3000>.

---

## 🔍 Running checks

Before opening a pull request, run the full test + lint pipeline locally:

```bash
npm run lint        # ESLint + Prettier
npm run types       # TypeScript
npm run test:unit   # Unit tests (Jest)
npm run test:e2e    # E2E tests (Playwright)
```

---

## 🧑‍💻 Making changes

* Create a new branch from `main` using a descriptive name, e.g. `feat/add-dark-mode`.
* Follow the [Conventional Commits](https://www.conventionalcommits.org) spec for commit messages (our CI enforces this).
* Keep pull requests small and focused (< ~300 LOC); large PRs are hard to review.
* Update documentation and tests alongside your code.

---

## ✅ Pull request checklist

- [ ] Title uses Conventional Commits format.
- [ ] Linked to an existing issue (or explains the use-case clearly).
- [ ] All CI checks pass.
- [ ] Added/updated tests.
- [ ] Updated documentation.

---

## 🛡 Security issues

Please **do not** open GitHub issues for security disclosures. Instead, email **security@example.com**.

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License unless stated otherwise. 