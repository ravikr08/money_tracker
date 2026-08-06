# Project Scope

## Project Name

**Money Manager** *(Working Title)*

---

# Overview

Money Manager is an offline-first personal finance web application that helps individuals manually manage their personal finances. Users can organize their money across multiple accounts, record income and expenses, manage recurring transactions, and view an overview of their financial health.

The application is designed to work completely offline, with all user data stored locally on the user's device.

This project is intended as a production-quality frontend application that emphasizes clean architecture, domain-driven design, and a great user experience.

---

# Objectives

## Primary Objectives

* Build an offline-first personal finance application.
* Improve frontend engineering and React development skills.
* Practice designing software from the domain before implementation.
* Build a maintainable, scalable, and portfolio-worthy application.

## Secondary Objectives

* Gain experience with application architecture.
* Practice state management and data persistence.
* Build reusable UI components.
* Design an application that can evolve into a cloud-based solution in future phases.

---

# Target Users

This application is intended for individuals who prefer to manually track and manage their personal finances.

Typical users may want to:

* Track daily expenses.
* Record income.
* Manage money across multiple accounts.
* Keep an overview of their financial position.
* Manage recurring income and expenses.

---

# Core Problems

The application aims to solve the following problems:

* Managing money spread across multiple accounts.
* Recording income and expenses quickly.
* Keeping an accurate account balance.
* Managing recurring financial transactions.
* Viewing an overall financial summary in one place.

---

# Scope (Phase 1)

The first phase of the application includes the following major capabilities.

## Account Management

Users can:

* Create accounts.
* Edit accounts.
* Archive accounts.
* View account balances.

Examples of accounts:

* Savings Account
* Salary Account
* Cash Wallet
* Digital Wallet

---

## Transaction Management

Users can:

* Add income.
* Add expenses.
* Edit transactions.
* Delete transactions.
* View transaction history.

---

## Categories

Users can:

* Use predefined categories.
* Create custom categories.
* Organize transactions using categories.

---

## Recurring Transactions

Users can:

* Create recurring transaction rules.
* Edit recurring rules.
* Delete recurring rules.
* View recurring transactions.

---

## Dashboard

Users can view:

* Total balance.
* Total income.
* Total expenses.
* Recent transactions.
* Account summaries.

---

# Non-Functional Requirements

The application should:

* Work completely offline.
* Store all data locally on the user's device.
* Be responsive across desktop and mobile devices.
* Provide a fast and intuitive user experience.
* Maintain a clean and scalable codebase.

---

# Out of Scope (Phase 1)

The following features are intentionally excluded from Phase 1:

* Cloud synchronization
* Multi-device synchronization
* Backend services
* User accounts
* Authentication
* Bank integrations
* UPI integration
* Budget planning
* Investment tracking
* Loan management
* Tax calculations
* OCR receipt scanning
* AI-powered financial insights
* Notifications and reminders
* Shared or family accounts
* Multi-currency support

These features may be considered in future phases.

---

# Technology Direction

Phase 1 will focus on a frontend-only architecture.

Planned technologies include:

* React
* TypeScript
* IndexedDB for local data storage
* Modern component-based architecture

The application should be designed so that a backend can be introduced in future versions without requiring major changes to the frontend architecture.

---

# Success Criteria

Phase 1 will be considered complete when:

* Users can manage multiple accounts.
* Users can record income and expenses.
* Users can manage recurring transactions.
* Dashboard accurately reflects financial data.
* Data persists locally between sessions.
* The application functions without an internet connection.
* The application is responsive and user-friendly.

---

# Future Vision

Potential future enhancements include:

* User authentication
* Cloud synchronization
* Multi-device support
* Budgets and financial goals
* Investment portfolio tracking
* Loan management
* Data import/export
* Advanced analytics
* AI-powered insights
* Bank integrations
* Progressive Web App enhancements

These features are intentionally outside the scope of Phase 1 and will be evaluated after the core application is complete.
