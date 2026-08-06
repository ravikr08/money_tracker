# 02 - Business Rules

# Purpose

This document defines the business rules that govern the behavior of the Money Manager application.

Business rules describe how the application should behave when users perform financial operations. They define validations, calculations, and state changes while remaining independent of user interface and implementation details.

---

# Rule Classification

Business rules are grouped by domain area.

* User
* Accounts
* Credit Card Accounts
* Transactions
* Categories
* Recurring Rules
* Financial Calculations

Each rule has a unique identifier.

---

# User Rules

## BR-USER-001

The application supports exactly one local user during Phase 1.

---

## BR-USER-002

All financial data belongs exclusively to the current user.

---

# Account Rules

## BR-ACC-001

An account must have a unique name.

---

## BR-ACC-002

Every account must belong to an account type.

---

## BR-ACC-003

An account may be created with an opening balance.

---

## BR-ACC-004

An archived account cannot receive new transactions.

---

## BR-ACC-005

Archived accounts remain available for historical records and reporting.

---

## BR-ACC-006

An account may be restored from the archived state.

---

## BR-ACC-007

An account cannot be permanently deleted if it has transaction history.

---

## BR-ACC-008

Negative account balances are allowed.

---

# Credit Card Rules

## BR-CC-001

Every credit card account has a credit limit.

---

## BR-CC-002

Credit card spending increases the outstanding balance.

---

## BR-CC-003

Credit card bill payments decrease the outstanding balance.

---

## BR-CC-004

Outstanding balance cannot become negative.

---

## BR-CC-005

A credit card payment must originate from a non-credit-card account.

---

## BR-CC-006

Payments cannot exceed the current outstanding balance.

---

## BR-CC-007

Archived credit card accounts cannot receive new transactions.

---

# Transaction Rules

## BR-TXN-001

Every transaction must have a positive monetary amount.

---

## BR-TXN-002

Every transaction must have a transaction date.

---

## BR-TXN-003

Future-dated transactions are not allowed.

---

## BR-TXN-004

Every transaction must belong to exactly one category.

---

## BR-TXN-005

Notes are optional.

---

## BR-TXN-006

Creating an Income transaction increases the destination account balance.

---

## BR-TXN-007

Creating an Expense transaction decreases the account balance.

---

## BR-TXN-008

Creating a Transfer transaction decreases the source account balance and increases the destination account balance by the same amount.

---

## BR-TXN-009

Creating a Credit Card Payment decreases the source account balance and decreases the credit card outstanding balance.

---

## BR-TXN-010

Editing a transaction recalculates all affected balances.

---

## BR-TXN-011

Deleting a transaction reverses its financial impact.

---

## BR-TXN-012

Transfer transactions must reference two different accounts.

---

## BR-TXN-013

Transfers between two credit card accounts are not allowed.

---

## BR-TXN-014

Credit Card Payment transactions require one regular account and one credit card account.

---

# Category Rules

## BR-CAT-001

Built-in categories cannot be modified.

---

## BR-CAT-002

Built-in categories cannot be deleted.

---

## BR-CAT-003

Users may create custom categories.

---

## BR-CAT-004

Users may edit custom categories.

---

## BR-CAT-005

Users may archive custom categories.

---

## BR-CAT-006

Categories that are referenced by existing transactions cannot be permanently deleted.

---

## BR-CAT-007

Categories support a maximum hierarchy depth of two levels.

---

# Recurring Rule Business Rules

## BR-REC-001

A Recurring Rule defines a template for generating future transactions according to a user-defined schedule.

---

## BR-REC-002

Users may configure recurrence using any supported repeat pattern, including but not limited to:

* Daily
* Weekly
* Monthly
* Yearly
* Custom intervals (future enhancement)

---

## BR-REC-003

Each generated transaction is an independent transaction after creation.

Generated transactions behave exactly like manually created transactions.

---

## BR-REC-004

Generated transactions are included in all calculations, reports, dashboards, account balances, spending summaries, and analytics.

The application does not distinguish between manually created and generated transactions during financial calculations.

---

## BR-REC-005

A Recurring Rule may be Active or Paused.

Only active rules generate new transactions.

---

## BR-REC-006

Editing a Recurring Rule provides the following options:

* Apply changes to future generated transactions only.
* Apply changes to all generated transactions.
* Apply changes only to already generated transactions.

---

## BR-REC-007

If the user chooses **Future Only**, previously generated transactions remain unchanged.

Only transactions generated after the modification reflect the updated rule.

---

## BR-REC-008

If the user chooses **Generated Transactions Only**, only existing generated transactions are updated.

The recurring rule itself remains unchanged.

---

## BR-REC-009

If the user chooses **All**, both the recurring rule and all generated transactions are updated.

---

## BR-REC-010

Deleting a Recurring Rule stops future transaction generation.

Previously generated transactions remain unchanged.

---

## BR-REC-011

When deleting a Recurring Rule, users may optionally choose to delete previously generated transactions.

Deleting generated transactions does not affect unrelated manually created transactions.

---

## BR-REC-012

Previously generated transactions remain fully editable after creation unless restricted by future application features.

---

## BR-REC-013

A generated transaction may be edited independently without requiring changes to its originating Recurring Rule.

## BR-REC-014

When an individual generated transaction is edited independently, it becomes detached from future changes to the recurring rule unless the user explicitly chooses to reapply the rule.

---

# Financial Calculation Rules

## BR-FIN-001

Account Balance is derived from all transactions affecting the account.

---

## BR-FIN-002

Credit Card Outstanding Balance is derived from credit card spending and payments.

---

## BR-FIN-003

Net Worth is calculated as:

Net Worth = Total Assets − Total Outstanding Liabilities

---

## BR-FIN-004

Dashboard values must always reflect the latest financial data.

---

# General Rules

## BR-GEN-001

All monetary values use a single currency.

---

## BR-GEN-002

Monetary values support up to two decimal places.

---

## BR-GEN-003

All financial operations must preserve data consistency.

---

## BR-GEN-004

Historical financial records must remain auditable.

---

# Future Rules

The following business capabilities are intentionally excluded from Phase 1.

* Bank synchronization
* Investment valuation
* Loan amortization
* Budget enforcement
* Tax calculations
* Multi-currency conversion
* AI-generated financial recommendations

These rules may be introduced in future versions without affecting the existing rule set.
