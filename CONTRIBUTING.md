# Contributing to Wix CMS SDK

Thank you for your interest in contributing to **Wix CMS SDK**.  
Your support helps maintain and improve this open-source project for the developer community.

This document outlines how to contribute effectively and responsibly.

## How You Can Contribute

You can contribute in several ways:

- **Report bugs** — Open an issue describing the problem, how to reproduce it, and what behavior you expected.  
- **Suggest features** — Propose enhancements or new capabilities. Explain their value and possible implementation.  
- **Submit code improvements** — Fix bugs, improve performance, or refactor for clarity.  
- **Improve documentation** — Fix typos, clarify explanations, or expand examples.

## Development Setup

Follow these steps to set up your development environment:

1. **Fork the repository**  
   Click "Fork" in the top-right corner of the repository page.

2. **Clone your fork**
   ```bash
   git clone https://github.com/<your-username>/wix-cms-sdk.git
   cd wix-cms-sdk
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Run linting and build**

   ```bash
   npm run lint
   npm run build
   ```

## Code Style Guidelines

This project uses **ESLint** for code quality and consistency.

* Run `npm run lint` before committing.
* Use **ES Modules** (`import` / `export`).
* Maintain consistent code style and indentation.
* Use descriptive variable and function names.
* Add **JSDoc comments** to all public functions and classes.

Example:

```js
/**
 * Retrieves items from the CMS collection.
 * @param {string} collection - The collection name.
 * @returns {Promise<object>} The retrieved data.
 */
async function getItems(collection) { ... }
```

## Testing Changes

Before submitting changes:

* Test your code against a real Wix site if possible.
* Ensure that existing functionality is not broken.
* Provide usage examples for new features in the documentation or `/examples` directory.
* Verify that the build process runs without errors.

## Commit and Pull Request Process

1. **Create a new branch**

   ```bash
   git checkout -b feat/my-feature
   ```

2. **Write clear, conventional commit messages**

   ```bash
   git commit -m "feat(queryBuilder): add support for nested conditions"
   ```

   Follow the [Conventional Commits](https://www.conventionalcommits.org/) format when possible.

3. **Push your branch**

   ```bash
   git push origin feat/my-feature
   ```

4. **Open a Pull Request**

   * Go to your fork on GitHub.
   * Click "Compare & pull request".
   * Provide a clear description of what you changed and why.
   * Link related issues if applicable.

Pull Requests should include:

* A clear explanation of the purpose and scope.
* Confirmation that all lints and builds pass.
* Updated documentation when introducing new functionality.

## Acknowledgment

Your contributions, whether small or large, help make this SDK better for everyone.
Thank you for your time, effort, and collaboration.
