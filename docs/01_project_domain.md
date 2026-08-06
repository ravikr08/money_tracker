# 01 - Domain

# Purpose

This document defines the core business domain of the Money Manager application.

It establishes the business concepts, their meanings, relationships, and constraints without describing application behavior, business processes, user interactions, or implementation details.

This document serves as the single source of truth for the application's domain model.

---

# Domain Overview

Money Manager is an offline-first personal finance application that enables individuals to manually manage their finances across multiple financial accounts.

The application models where money is stored, how financial activities are represented, how transactions are classified, and how recurring financial activities are defined.

The domain is intentionally independent of any technology, user interface, database, or backend implementation.

---

# Domain Glossary

| Term                | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| User                | Owner of all financial data within the application.                                   |
| Account             | A place where money is stored or managed.                                             |
| Credit Card Account | A specialized account representing borrowed money and outstanding liability.          |
| Transaction         | A financial event that records the movement of money.                                 |
| Category            | A classification used to organize transactions.                                       |
| Recurring Rule      | A reusable definition for transactions that occur repeatedly according to a schedule. |
| Balance             | Monetary value associated with an account.                                            |
| Outstanding Balance | Unpaid liability associated with a credit card account.                               |
| Net Worth           | Overall financial position derived from assets and liabilities.                       |

---

# Aggregate Root

## User

### Purpose

Represents the owner of all financial information managed by the application.

During Phase 1, the application supports a single local user. The domain is designed so that future versions can support multiple authenticated users without changing the core business model.

### Owns

* Accounts
* Credit Card Accounts
* Transactions
* Categories
* Recurring Rules
* User Preferences

---

# Domain Entities

## 1. Account

### Purpose

Represents a place where money is stored or managed.

### Examples

* Savings Account
* Salary Account
* Current Account
* Cash Wallet
* Digital Wallet

### Attributes

* Name
* Account Type
* Opening Balance
* Current Balance
* Status
* Description

---

## 2. Credit Card Account

### Purpose

Represents a credit facility provided by a financial institution.

Unlike regular accounts, a credit card account represents borrowed money that must be repaid.

### Examples

* HDFC Millennia Credit Card
* SBI Cashback Card
* Amazon Pay ICICI Credit Card

### Attributes

* Name
* Credit Limit
* Outstanding Balance
* Billing Cycle
* Statement Date
* Payment Due Date
* Status

---

## 3. Transaction

### Purpose

Represents a financial event affecting one or more financial accounts.

### Transaction Types

* Income
* Expense
* Transfer
* Credit Card Payment

### Attributes

* Transaction Type
* Amount
* Date
* Account(s)
* Category
* Notes

---

## 4. Category

### Purpose

Provides a classification system for organizing financial transactions.

### Structure

Categories follow a two-level hierarchy.

Example:

```text
Food
├── Grocery
├── Restaurant
└── Snacks
```

### Attributes

* Name
* Parent Category (optional)
* Icon
* Color

---

## 5. Recurring Rule

### Purpose

Represents a reusable definition for transactions that occur repeatedly according to a schedule.

A recurring rule defines when and how future transactions should occur.

### Supported Frequencies

* Daily
* Weekly
* Monthly
* Yearly

### Attributes

* Transaction Template
* Frequency
* Start Date
* End Date (optional)
* Status

---

# Value Objects

The following concepts represent values rather than entities.

## Money

Represents a monetary amount.

---

## Account Type

Represents the classification of an account.

Examples include:

* Savings
* Current
* Cash
* Wallet
* Credit Card
* Custom

---

## Transaction Type

Represents the type of financial event.

Values include:

* Income
* Expense
* Transfer
* Credit Card Payment

---

## Date

Represents the calendar date associated with financial activities.

---

# Entity Relationships

```text
User
│
├── Accounts
│
├── Credit Card Accounts
│
├── Transactions
│     ├── References Account(s)
│     └── References Category
│
├── Categories
│
└── Recurring Rules
       └── Define recurring transactions
```

---

# Derived Concepts

The following concepts are derived from domain entities and are not independent business entities.

## Account Balance

Represents the current monetary value of an account.

---

## Credit Card Outstanding Balance

Represents the unpaid liability associated with a credit card account.

---

## Net Worth

Represents the user's overall financial position derived from assets and liabilities.

---

## Dashboard

Represents a presentation of domain information for the user.

The dashboard is a projection of domain data and is not a domain entity.

---

# Domain Constraints

The following invariants define the structure of the domain.

* Every User owns all financial data.
* Every Account belongs to exactly one User.
* Every Credit Card Account belongs to exactly one User.
* Every Transaction belongs to exactly one User.
* Every Category belongs to exactly one User.
* Every Recurring Rule belongs to exactly one User.
* Every Transaction references one or more financial accounts.
* Every Transaction belongs to exactly one category.
* Categories support a maximum of two hierarchy levels.
* The application operates using a single currency.
* Monetary values support up to two decimal places.

---

# Assumptions

The current domain model assumes:

* The application is intended for personal finance management.
* Financial data is entered manually by the user.
* Phase 1 supports a single local user.
* Data is stored locally.
* The domain model remains independent of storage, presentation, and implementation technologies.

---

# Out of Scope

The following concepts are intentionally excluded from the current domain model.

* Multi-user collaboration
* Cloud synchronization
* Bank integrations
* Investment portfolio management
* Loan management
* Budget planning
* Financial goals
* Tax calculations
* OCR receipt scanning
* AI-generated financial insights
* Multi-currency support

These concepts may be introduced in future phases without fundamentally changing the existing domain model.
