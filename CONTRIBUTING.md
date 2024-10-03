# Contribution Guide

We welcome contributions to the `hashtegrity` project! Follow these steps to get started:

## Fork the Repository

1. **Fork the repository**: Click the "Fork" button at the top right of the repository page.
2. **Install pnpm**: Visit the [official site](https://pnpm.io/) to install pnpm.
3. **Clone your fork**: Clone your forked repository to your local machine.
   ```bash
   git clone https://github.com/ITZSHOAIB/hashtegrity.git
   cd hashtegrity
   pnpm install
   ```

## Create a New Branch

Create a new branch for your feature or bugfix.
```bash
git checkout -b my-feature-branch
```

## Make Your Changes

Implement your feature or bugfix.

## Run Tests

Ensure all tests pass.
```bash
pnpm test
```

## Create a Changeset

Create a changeset to describe your changes.
```bash
pnpm changeset
```

## Commit Your Changes

Commit your changes with a descriptive commit message following the GitHub convention (e.g., `feat:`, `docs:`, `fix:`, etc.).
```bash
git commit -m "feat: Add feature XYZ"
```

## Push to Your Fork

Push your changes to your forked repository.
```bash
git push origin my-feature-branch
```

## Create a Pull Request

Open a pull request to the main repository. Provide a clear description of your changes and why they are necessary.

Thank you for contributing!