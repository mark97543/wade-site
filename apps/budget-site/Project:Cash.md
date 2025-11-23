# PROJECT CASH: Master Specification

**C**an't **A**ctually **S**pend **H**ardly-anything

## 1. Project Overview

Objective: A financial dashboard focused on liquidity ("Cash Flow") rather than just accounting.

Core Difficulty: 6/10 (Due to rolling balance algorithms and recurring date math).

Tech Stack: React (Frontend), Directus (Backend/Auth/DB), Recharts (Charts).

Authentication: Handled externally (Site/Directus default).

## 2. Global Layout & Navigation

The app uses a fixed **Left Sidebar** layout (Desktop) and **Bottom Navigation** (Mobile). It assumes a single primary "Operating Account".

### A. Desktop Layout (Sidebar)

*Breakpoint: > 768px*

```
+-------------------+-------------------------------------------------------+
|  PROJECT CASH     |                                                       |
|                   |                                                       |
|  [ NAVIGATION ]   |                                                       |
|                   |                                                       |
|  [#] Dashboard    |           [ DYNAMIC VIEWPORT AREA ]                   |
|                   |                                                       |
|  [$] Budget       |           (Content changes based                      |
|                   |            on selected tab)                           |
|  [=] Transactions |                                                       |
|      -> All       |                                                       |
|      -> Income    |                                                       |
|      -> Expenses  |                                                       |
|                   |                                                       |
|  [%] Debt         |                                                       |
|                   |                                                       |
|  [*] Goals        |                                                       |
|                   |                                                       |
|  [@] Settings     |                                                       |
+-------------------+-------------------------------------------------------+
```

### B. Mobile Layout (Bottom Nav)

*Breakpoint: < 768px*

```
+-------------------------------------------------------+
|  [ Current View Title ]                     [ Filter] |
+-------------------------------------------------------+
|                                                       |
|            [ DYNAMIC VIEWPORT AREA ]                  |
|                                                       |
+-------------------------------------------------------+
|  [#]      [=]       [ + ]       [*]       [@]         |
|  Dash     Trans      ADD        Goals     Menu        |
+-------------------------------------------------------+
```

## 3. Database Schema (Directus)

### `accounts`

- `id` (UUID)
- `user_id` (M2O -> directus_users)
- `name` (String) - *e.g., "Main Checking"*
- `starting_balance` (Float)

### `transactions`

- `id` (UUID)
- `account_id` (M2O -> accounts) - *Hidden/Defaulted to primary account.*
- `date` (Timestamp)
- `payee` (String)
- `category` (String)
- `amount` (Float) — *Negative for expense, Positive for income.*
- `is_cleared` (Boolean)

### `recurring_transactions`

- `id` (UUID)
- `payee` (String)
- `category` (String)
- `amount` (Float)
- `frequency` (String: "monthly", "weekly")
- `next_due_date` (Date)
- `original_day` (Integer)

### `debts`

- `id` (UUID)
- `name` (String)
- `initial_principal` (Float)
- `interest_rate` (Float)
- `term_months` (Integer)
- `standard_payment` (Float)

### `goals`

- `id` (UUID)
- `name` (String)
- `target_amount` (Float)
- `priority` (Integer)

### `budgets`

- `id` (UUID)
- `category` (String)
- `target_amount` (Float)

## 4. Core Algorithms

### A. Rolling Balances (Register)

Calculates "Ledger Balance" (Checking) and "Savings Pot" (Virtual) in real-time.

```
// Pseudo-code
// INPUT: transactions, startingBalance
let ledger = startingBalance;
let savings = 0;

transactions.forEach(tx => {
   ledger += tx.amount;
   
   // Bidirectional Savings Logic (Virtual Tracking)
   if (tx.category === 'Savings') savings += Math.abs(tx.amount); // Checking -> Savings Pot
   if (tx.category === 'From Savings') savings -= tx.amount;      // Savings Pot -> Checking
   
   tx.running_balance = ledger;
   tx.running_savings = savings;
});
```

### B. Savings Waterfall (Goals)

*Unchanged.*

### C. Debt Amortization

*Unchanged.*

## 5. View Specifications

### View 1: Dashboard (`/`)

**Logic:** Displays vitals for the single operating account.

**Wireframe:**

```
[ Vitals Row ]
[ Ledger: $4,200 ] [ Cleared: $3,800 ] [ Burn Ratio: 0.9 ]

[ Charts Row ]
[ Spend by Category (Pie) ]    [ Income vs Expense (Bar) ]

[ Action Row ]
[ ! ] Rent due in 3 days ($1500) -> [Post Transaction Button]
```

### View 2: Transaction Register (`/transactions`)

**Logic:** Shows the master list. Savings is tracked via the `SAVINGS` column.

#### A. Detailed Wireframe (Desktop)

```
+----------------------------------------------------------------------------------+
| [ Search Payee... ]  [ Date Range v ]  [x] Hide Cleared              [ + ADD ]   |
+----------------------------------------------------------------------------------+
| STAT | DATE    | PAYEE          | CATEGORY      | AMOUNT     | SAVINGS  | BALANCE |
+------+---------+----------------+---------------+------------+----------+---------+
|  [ ] | Nov 22  | Costco         | Groceries     |   -150.00  | 2,000.00 | 4,250.00|
|  [x] | Nov 21  | Transfer Out   | Savings       |   -500.00  | 2,000.00 | 4,400.00|
+------+---------+----------------+---------------+------------+----------+---------+
```

#### B. Component Architecture

1. **`Register.jsx`**
   - **Props:** `type`.
   - **Calculations:** Standard Rolling Balance engine.
2. **`TransactionRow.jsx`**
   - Unchanged.

### View 3: Strategy (`/goals` & `/debt`)

*Unchanged.*

### View 4: Budget (`/budget`)

*Unchanged.*

## 9. Interactive Modals & Forms

### A. Modal: Add Transaction

*Logic Update:* Removed Account Selector. Includes "Transfer" mode for virtual savings movement.

**Wireframe:**

```
+-------------------------------------------+
|  Add Transaction                      [X] |
+-------------------------------------------+
|  Type:  (o) Expense  ( ) Income  ( ) Transfer |
|                                           |
|  Date:  [ 11/22/2025 ]                    |
|                                           |
|  Payee: [ Costco __________ ]             |
|                                           |
|  Amount: [ $ 150.00 ___ ]                 |
|                                           |
|  IF TRANSFER SELECTED:                    |
|    Action: [ To Savings v ] (or From Savings)|
|                                           |
|  IF EXPENSE/INCOME SELECTED:              |
|    Category: [ Groceries v ]              |
|                                           |
|  [x] Cleared / Posted to Bank             |
+-------------------------------------------+
|            [ CANCEL ]  [ SAVE ]           |
+-------------------------------------------+
```

### B. View: Recurring Manager

*Unchanged.*

### C. View: Goal Editor

*Unchanged.*

## 10. Mobile Strategy & Responsiveness

### A. Navigation Transformation

- **Desktop:** Fixed Sidebar.
- **Mobile:** Fixed Bottom Tab Bar.

### B. Register View Optimization

*Unchanged.*

## 11. Settings & Configuration

### A. Category Management

- **Location:** `/settings` -> Tabs -> `Categories`.
- **Functionality:** Create/Delete categories.

### B. Day Zero Onboarding

- **Trigger:** First login.
- **Modal:** "What is the starting balance for your Main Checking Account?"
- **Action:** Creates a hidden transaction.

## 12. React Component Structure

```
src/
├── layouts/
│   ├── MainLayout.jsx       (Responsive Shell)
│   ├── Sidebar.jsx          (Desktop Nav)
│   └── BottomNav.jsx        (Mobile Nav)
├── views/
│   ├── Dashboard.jsx
│   ├── Register.jsx         
│   ├── Strategy.jsx         
│   ├── Budget.jsx
│   └── Settings.jsx
├── components/
│   ├── register/
│   │   ├── TransactionTable.jsx
│   │   ├── TransactionList.jsx
│   │   └── AddTransactionModal.jsx
│   └── ...
└── hooks/
    ├── useRollingBalance.js
    └── useAmortization.js
```
