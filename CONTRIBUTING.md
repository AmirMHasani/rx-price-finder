# Contributing to RxPriceFinder

Thank you for your interest in contributing to RxPriceFinder! This document provides guidelines and instructions for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Common Tasks](#common-tasks)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, gender, gender identity, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or discriminatory comments
- Personal attacks or insults
- Publishing others' private information without permission
- Any conduct that could be considered inappropriate in a professional setting

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ (LTS recommended)
- pnpm 9+ (package manager)
- MySQL 8+ or TiDB (database)
- Git for version control

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/rx-price-finder.git
cd rx-price-finder
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/AmirMHasani/rx-price-finder.git
```

### Install Dependencies

```bash
pnpm install
```

### Set Up Environment

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Fill in the required environment variables (see README.md for details)

3. Initialize the database:

```bash
pnpm db:push
```

### Start Development Server

```bash
pnpm dev
```

---

## 🔄 Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or fixes

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Check TypeScript types
pnpm type-check
```

### 4. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git commit -m "feat: add pharmacy price history chart"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test additions or fixes
- `chore:` - Build process or tooling changes

### 5. Keep Your Branch Updated

Regularly sync with the upstream repository:

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push Your Changes

```bash
git push origin feature/your-feature-name
```

---

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use type inference where appropriate

```typescript
// ✅ Good
interface PharmacyResult {
  name: string;
  address: string;
  price: number;
}

// ❌ Bad
const result: any = {...};
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use shadcn/ui components when available
- Keep custom CSS minimal

```tsx
// ✅ Good
<div className="flex items-center gap-4 p-4 rounded-lg bg-white shadow-sm">
  <span className="text-lg font-semibold">Price: $10.99</span>
</div>
```

### File Organization

- One component per file
- Group related files in directories
- Use index files for cleaner imports
- Keep files under 300 lines when possible

```
components/
├── pharmacy/
│   ├── PharmacyCard.tsx
│   ├── PharmacyList.tsx
│   ├── PharmacyMap.tsx
│   └── index.ts
```

---

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for all new features
- Test edge cases and error conditions
- Use descriptive test names
- Aim for 80%+ code coverage

```typescript
describe('calculateInsuranceCopay', () => {
  it('should return tier 1 copay for generic medications', () => {
    const copay = calculateInsuranceCopay(10.00, 'tier1', false);
    expect(copay).toBe(5.00);
  });

  it('should cap copay at cash price', () => {
    const copay = calculateInsuranceCopay(3.00, 'tier1', false);
    expect(copay).toBe(3.00);
  });
});
```

### Integration Tests

- Test API endpoints
- Test database operations
- Test authentication flows
- Mock external APIs

### Manual Testing

Before submitting a PR, manually test:
- The feature works as expected
- No console errors
- Responsive design on mobile/desktop
- Accessibility (keyboard navigation, screen readers)

---

## 📝 Pull Request Process

### Before Submitting

1. **Update documentation** - README, comments, JSDoc
2. **Run tests** - Ensure all tests pass
3. **Check types** - No TypeScript errors
4. **Format code** - Run `pnpm format`
5. **Update CHANGELOG** - Add entry for your changes

### PR Title Format

Use clear, descriptive titles:

```
feat: Add pharmacy price history chart
fix: Resolve insurance copay calculation error
docs: Update API documentation
```

### PR Description Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests passing

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

### Review Process

1. **Automated checks** - CI/CD pipeline must pass
2. **Code review** - At least one maintainer approval required
3. **Testing** - Reviewer will test the changes
4. **Feedback** - Address any requested changes
5. **Merge** - Maintainer will merge once approved

---

## 🛠️ Common Tasks

### Adding a New Insurance Carrier

1. Edit `client/src/data/insuranceCarriers.ts`
2. Add carrier to `INSURANCE_CARRIERS` array (alphabetically)
3. Add plans to carrier's `plans` array
4. Update `client/src/data/insurance.ts` with plan copay structure
5. Add tests for the new carrier

### Adding a New Medication to Brand Database

1. Edit `client/src/data/brandMedications.ts`
2. Add medication with pricing data:
   ```typescript
   {
     name: "Eliquis",
     rxcui: "1364430",
     wholesaleCost: 450.00,
     retailPrice: 600.00,
     tier: "tier3",
     frequency: "twice daily"
   }
   ```
3. Test pricing calculation with the new medication

### Updating Translations

1. Edit `client/src/translations/en.ts` for English
2. Edit `client/src/translations/es.ts` for Spanish
3. Use dot notation keys: `home.hero.title`
4. Maintain parity between both files

### Debugging Pricing Issues

1. Check browser console for pricing service logs
2. Look for "Using [source]" messages
3. Verify medication name matches database entries
4. Check insurance plan ID matches
5. Ensure copay ≤ cash price

---

## 📧 Questions?

If you have questions or need help:

1. Check existing [Issues](https://github.com/AmirMHasani/rx-price-finder/issues)
2. Read the [README.md](README.md) and [ROADMAP.md](ROADMAP.md)
3. Open a new issue with the `question` label
4. Join our community discussions

---

## 🙏 Thank You!

Your contributions make RxPriceFinder better for everyone. We appreciate your time and effort!
