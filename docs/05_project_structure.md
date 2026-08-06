# Architecture

## Purpose

This document defines the technical architecture of the Money Manager application.

The goal of this architecture is to build a maintainable, scalable, and portfolio-quality React application while keeping the implementation simple enough to complete the MVP within the planned timeline.

This document describes:

- Project structure
- Layer responsibilities
- Module organization
- State management strategy
- Data flow
- Technology stack
- Coding principles

It intentionally avoids implementation details of individual features, which are documented elsewhere.

---

# Architecture Goals

The architecture is designed to achieve the following goals:

- Feature-based organization
- Separation of concerns
- Offline-first architecture
- Maintainable and scalable codebase
- Easy transition to a backend in future versions
- Easy to understand for new contributors
- Minimize overengineering for the MVP

---

# High-Level Architecture

```text
User
    │
    ▼
React UI
    │
    ▼
Redux Toolkit
    │
    ▼
Feature Services
    │
    ▼
Repositories
    │
    ▼
Dexie (IndexedDB)
```

### Responsibilities

| Layer | Responsibility |
|--------|----------------|
| UI | Display data and collect user input |
| Redux | Store global application state |
| Services | Business operations and feature logic |
| Repositories | Read/write data |
| Dexie | Persistent local storage |

---

# Project Structure

```text
money-manager/
│
├── public/
│
├── src/
│
│   ├── app/                           # Application bootstrap
│   │   │
│   │   ├── main.tsx                   # React entry point
│   │   ├── App.tsx                    # Root component
│   │   ├── router.tsx                 # React Router configuration
│   │   ├── providers.tsx              # Redux, Theme, Router providers
│   │   └── store.ts                   # Redux store configuration
│   │
│   ├── modules/                       # Feature modules
│   │
│   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   │   └── DashboardPage.tsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── BalanceCard.tsx
│   │   │   │   ├── IncomeExpenseChart.tsx
│   │   │   │   ├── RecentTransactions.tsx
│   │   │   │   └── AccountsOverview.tsx
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── dashboard.service.ts
│   │   │   │
│   │   │   └── store/
│   │   │       └── dashboardSlice.ts
│   │   │
│   │   ├── accounts/
│   │   │   ├── pages/
│   │   │   │   └── AccountsPage.tsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── AccountCard.tsx
│   │   │   │   ├── AccountList.tsx
│   │   │   │   ├── AccountForm.tsx
│   │   │   │   └── ArchiveAccountDialog.tsx
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── account.service.ts
│   │   │   │   └── account.validation.ts
│   │   │   │
│   │   │   ├── store/
│   │   │   │   ├── accountSlice.ts
│   │   │   │   ├── accountSelectors.ts
│   │   │   │   └── accountThunks.ts
│   │   │   │
│   │   │   └── account.types.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── pages/
│   │   │   │   └── TransactionsPage.tsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── TransactionList.tsx
│   │   │   │   ├── TransactionItem.tsx
│   │   │   │   ├── TransactionForm.tsx
│   │   │   │   └── TransactionFilters.tsx
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── transaction.service.ts
│   │   │   │   └── transaction.validation.ts
│   │   │   │
│   │   │   ├── store/
│   │   │   │   ├── transactionSlice.ts
│   │   │   │   ├── transactionSelectors.ts
│   │   │   │   └── transactionThunks.ts
│   │   │   │
│   │   │   └── transaction.types.ts
│   │   │
│   │   ├── categories/
│   │   ├── recurring/
│   │   ├── reports/
│   │   └── settings/
│   │
│   ├── shared/                        # Shared across multiple modules
│   │
│   │   ├── components/
│   │   │
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Footer.tsx
│   │   │   │
│   │   │   └── ui/                    # shadcn components
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── input.tsx
│   │   │       ├── select.tsx
│   │   │       ├── table.tsx
│   │   │       └── ...
│   │   │
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── useDisclosure.ts
│   │   │   └── useLocalStorage.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── currency.ts
│   │   │   ├── date.ts
│   │   │   ├── number.ts
│   │   │   └── formatter.ts
│   │   │
│   │   └── constants/
│   │       ├── routes.ts
│   │       └── app.ts
│   │
│   ├── infrastructure/                # External systems
│   │
│   │   ├── database/
│   │   │   ├── db.ts                  # Dexie configuration
│   │   │   └── migrations.ts
│   │   │
│   │   └── repositories/
│   │       ├── account.repository.ts
│   │       ├── transaction.repository.ts
│   │       ├── category.repository.ts
│   │       └── recurring.repository.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   └── index.css                      # Tailwind entry + global styles
│
├── docs/
│   ├── 00-project-scope.md
│   ├── 01-domain.md
│   ├── 02-business-rules.md
│   ├── 03-features.md
│   ├── 04-user-flows.md
│   └── 05_project_structure.md
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── prettier.config.js
└── README.md
```

---

# Folder Responsibilities

## app/

Contains application-wide configuration.

### Responsibility

Anything that exists only once in the application.

### Contents

- React entry point
- App component
- Router
- Providers
- Redux Store

Example

```text
app/

main.tsx

App.tsx

router.tsx

providers.tsx

store.ts
```

---

## modules/

Contains feature modules.

Each module owns everything related to that feature.

Examples:

- Dashboard
- Accounts
- Transactions
- Categories
- Recurring Rules
- Reports
- Settings

Each feature should be as self-contained as possible.

---

### Module Structure

```text
accounts/

pages/

components/

services/

store/

account.types.ts
```

---

### pages/

Entry points for routed pages.

Examples:

- AccountsPage
- DashboardPage
- TransactionsPage

Responsibilities:

- Compose the page
- Arrange components
- Connect UI to state

Pages should contain very little business logic.

---

### components/

Feature-specific UI.

Examples:

- AccountCard
- AccountList
- AccountForm
- TransactionFilters

These components should not be reused by unrelated modules.

---

### services/

Contains business operations for the feature.

Examples:

- createAccount()
- archiveAccount()
- restoreAccount()
- createExpense()
- createTransfer()
- payCreditCard()

Responsibilities:

- Business logic
- Validation orchestration
- Coordinate repositories

Services should not contain UI code.

---

### store/

Redux Toolkit files for the feature.

Examples:

```text
accountSlice.ts

accountSelectors.ts

accountThunks.ts
```

Responsibilities:

- Global state
- Async actions
- Reducers
- Selectors

Each feature owns its own Redux slice.

---

### account.types.ts

Feature-specific types.

Only create additional folders if the number of files grows.

Avoid creating folders for a single file.

---

# shared/

Contains code shared by multiple modules.

Nothing here should belong to only one feature.

---

## shared/components/

Reusable UI.

### layout/

Application shell.

Examples:

- AppLayout
- Sidebar
- Header
- Footer

---

### ui/

Reusable UI components.

Generated using shadcn/ui and customized for the project.

Examples:

- Button
- Card
- Input
- Dialog
- Select
- Table

These form the application's design system.

---

## shared/hooks/

Reusable hooks.

Examples:

- useDebounce()
- useDisclosure()
- useClickOutside()

Do not place feature-specific hooks here.

---

## shared/utils/

Pure utility functions.

Examples:

- formatCurrency()
- formatDate()
- formatNumber()

Utilities should not contain business logic.

---

## shared/constants/

Application-wide constants.

Examples:

- routes
- application constants

Avoid creating feature-specific constants here.

---

# infrastructure/

Contains implementation details related to external systems.

The rest of the application should not know how data is stored.

---

## database/

Dexie configuration.

Examples:

- db.ts
- migrations.ts

---

## repositories/

Data access layer.

Examples:

- account.repository.ts
- transaction.repository.ts
- category.repository.ts

Responsibilities:

- Save data
- Read data
- Update data
- Delete data

Repositories should not contain business rules.

---

# assets/

Static assets.

Examples:

- Images
- Icons
- Fonts

---

# Styling

The project uses Tailwind CSS.

Only one global stylesheet exists.

```text
index.css
```

Global styles should remain minimal.

Most styling should be implemented using Tailwind utility classes.

---

# State Management Strategy

Different kinds of state require different tools.

| State Type | Tool |
|------------|------|
| Local UI State | useState |
| Form State | React Hook Form |
| Global Application State | Redux Toolkit |
| Persistent State | Dexie (IndexedDB) |

---

## Local UI State

Examples:

- Dialog open/close
- Active tab
- Dropdown state
- Accordion state

Use:

```text
useState()
```

---

## Form State

Examples:

- Transaction Form
- Account Form
- Category Form

Use:

```text
React Hook Form
```

---

## Global State

Examples:

- Accounts
- Transactions
- Categories
- Recurring Rules
- Settings

Use:

```text
Redux Toolkit
```

---

## Persistent State

Everything stored permanently.

Use:

```text
Dexie (IndexedDB)
```

---

# Redux Organization

There is only one Redux store.

```text
app/

store.ts
```

Each feature owns its slice.

Example:

```text
accounts/

store/

accountSlice.ts
```

The global store combines all slices.

```text
accounts

transactions

categories

recurring

settings
```

---

# Data Flow

Whenever the user performs an action:

```text
User

↓

React Component

↓

React Hook Form

↓

Redux Action

↓

Feature Service

↓

Repository

↓

Dexie

↓

Redux Updated

↓

UI Re-renders
```

This separation keeps each layer focused on a single responsibility.

---

# Technology Stack

| Category | Technology |
|----------|------------|
| Build Tool | Vite |
| Language | TypeScript |
| Framework | React |
| Routing | React Router |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| State Management | Redux Toolkit |
| Forms | React Hook Form |
| Validation | Zod |
| Local Database | Dexie |
| Charts | Recharts |
| Date Utilities | date-fns |
| Linting | ESLint |
| Formatting | Prettier |

---

# Design Principles

## Feature-Based Organization

Keep related code together.

Features own:

- UI
- Services
- Redux
- Types

---

## Separation of Concerns

Every layer has one responsibility.

- UI renders.
- Redux stores state.
- Services implement business operations.
- Repositories manage persistence.

---

## Reusability

Shared code belongs in `shared/`.

Feature-specific code belongs inside the feature.

---

## Simplicity

Avoid creating folders before they are needed.

Architecture should evolve with the project.

---

## Consistency

Every feature should follow the same structure.

Developers should immediately know where new code belongs.

---

# Folder Creation Guidelines

Create new folders only when justified.

Examples:

✅ Good

```text
components/

AccountCard.tsx

AccountList.tsx

AccountForm.tsx
```

❌ Bad

```text
hooks/

useAccount.ts
```

A folder containing only one file usually isn't necessary.

Let the architecture grow naturally.

---

# Future Evolution

This architecture is designed to support future enhancements such as:

- REST API integration
- Authentication
- Cloud synchronization
- Multi-user support
- Backend services

These additions should require minimal changes to the existing project structure.

---

# Summary

The architecture follows a feature-based approach that balances simplicity and scalability.

Key characteristics:

- Feature-oriented organization
- Clear separation of responsibilities
- Offline-first design
- Single Redux store with feature slices
- Dexie for local persistence
- Tailwind + shadcn/ui for the design system
- Minimal boilerplate
- Easy to extend as the application grows