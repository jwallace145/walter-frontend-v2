# WalterAI Frontend

> A modern financial wellness platform that helps users organize their finances, grow their net worth, and save for retirement wisely — powered by AI.

## ✨ Features

- 🏦 **Account Aggregation** - Securely connect financial institutions via Plaid Link
- 💳 **Transaction Management** - Browse, search, categorize, and update transactions
- 📊 **Data Visualization** - Interactive charts for spending patterns and cash flow analysis
- 🤖 **AI-Powered Insights** - Smart recommendations for financial wellness
- 🔒 **Secure Authentication** - Cookie-based auth with automatic token refresh

---

## 🚀 Tech Stack

| Category               | Technologies                         |
| ---------------------- | ------------------------------------ |
| **Framework**          | Next.js 15 (React 19) with Turbopack |
| **Language**           | TypeScript                           |
| **Styling**            | Tailwind CSS v4                      |
| **UI Components**      | Headless UI, Heroicons               |
| **Data Visualization** | Nivo Charts, D3.js                   |
| **HTTP Client**        | Axios                                |
| **Utilities**          | Day.js                               |
| **Code Quality**       | ESLint, Prettier, Husky, lint-staged |

---

## 🏗️ Architecture

The frontend uses a **secure proxy pattern** to communicate with the Walter Backend, keeping API keys and tokens server-side.

```
┌─────────────────┐
│   Browser UI    │  React components, pages
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Routes     │  Next.js API routes (/api/*)
│  (Proxy Layer)  │  - Auth handling
└────────┬────────┘  - Token refresh
         │           - Request forwarding
         ▼
┌─────────────────┐
│ Walter Backend  │  Core API services
└─────────────────┘
```

### Key Layers

**UI Layer** (`src/components`, `app/pages`)

- React components and Next.js pages

**API Proxy Layer** (`src/pages/api/**`)

- Forwards requests to Walter Backend
- Manages authentication and token refresh
- Handles 401 responses automatically

**Typed Proxy Client** (`src/lib/proxy/client.ts`)

- Browser-side client for calling `/api/*` routes
- Strongly-typed responses

**Backend Client** (`src/lib/backend/client.ts`)

- Server-side client for Walter Backend
- Manages access/refresh tokens via cookies

---

## 📁 Project Structure

```
src/
├── components/
│   ├── transactions/
│   │   ├── TransactionItem.tsx          # Transaction list item with actions
│   │   ├── UpdateTransactionModal.tsx   # Edit merchant name & category
│   │   └── TransactionCategoryBadge.tsx # Category display component
│   └── ...
├── lib/
│   ├── models/
│   │   ├── account.ts                   # Account types
│   │   ├── transaction.ts               # Transaction types & enums
│   │   └── User.ts                      # User types
│   ├── proxy/
│   │   ├── client.ts                    # Browser API client
│   │   ├── endpoints.ts                 # API endpoint definitions
│   │   └── responses.ts                 # Typed API responses
│   └── backend/
│       ├── client.ts                    # Backend API client
│       └── endpoints.ts                 # Backend endpoint definitions
└── pages/
    └── api/                             # Next.js API routes (proxy)
        ├── auth/
        ├── accounts/
        ├── transactions/
        └── plaid/
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file with:

```bash
WALTER_BACKEND_API_URL=https://api.example.com
WALTER_BACKEND_API_KEY=your_api_key_here
```

### Development

```bash
# Start dev server with Turbopack
pnpm dev

# Open http://localhost:3000
```

### Available Scripts

| Script        | Description                             |
| ------------- | --------------------------------------- |
| `pnpm dev`    | Start development server with Turbopack |
| `pnpm build`  | Build for production                    |
| `pnpm start`  | Start production server                 |
| `pnpm lint`   | Run ESLint                              |
| `pnpm format` | Format code with Prettier               |

---

## 🔌 API Reference

### Proxy Endpoints

All API routes are located in `src/pages/api/` and proxy to the Walter Backend:

#### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

#### Users

- `POST /api/users/create-user` - Create new user

#### Accounts

- `GET /api/accounts/get-accounts` - List all accounts and balances

#### Transactions

- `GET /api/transactions/get-transactions` - Fetch transactions with filters
- `PUT /api/transactions/update-transaction` - Update merchant name or category

#### Plaid Integration

- `POST /api/plaid/create-link-token` - Generate Plaid Link token
- `POST /api/plaid/exchange-public-token` - Exchange public token for access token
- `POST /api/plaid/sync-transactions` - Trigger transaction sync

### Usage Example

```typescript
import { WalterBackendProxy } from '@/lib/proxy/client';

// Fetch transactions
const response = await WalterBackendProxy.getTransactions({
  page: 1,
  page_size: 50,
  sort_by: 'transaction_date',
  sort_order: 'desc',
});

// Update transaction
await WalterBackendProxy.updateTransaction(transactionId, {
  merchant_name: 'New Merchant',
  transaction_category: TransactionCategory.GROCERIES,
});
```

---

## 🎨 Component Architecture

### Transaction Components

**TransactionItem** (`src/components/transactions/TransactionItem.tsx`)

- Pure presentation component for transaction list items
- Accepts callback props for actions (`onViewDetails`, `onCategorize`)
- No API logic - maintains separation of concerns

```typescript
<TransactionItem
  transaction={transaction}
  onViewDetails={(tx) => handleViewDetails(tx)}
  onCategorize={(tx) => handleCategorize(tx)}
/>
```

**UpdateTransactionModal** (`src/components/transactions/UpdateTransactionModal.tsx`)

- Modal for editing merchant name and category
- Handles API calls internally via `WalterBackendProxy.updateTransaction()`

---

## 🔒 Security

- ✅ API keys and tokens stored server-side only
- ✅ Secure HTTP-only cookies for authentication
- ✅ Automatic token refresh on 401 responses
- ✅ No sensitive data exposed to browser
- ✅ Plaid Link tokens generated server-side

---

## 🧪 Code Quality

- **ESLint** - Next.js config with additional plugins
- **Prettier** - Consistent code formatting
- **Husky** - Git hooks for pre-commit checks
- **lint-staged** - Runs linters on staged files
- **GitHub Actions** - Automated CI/CD pipeline

### Pre-commit Hooks

```bash
# Automatically runs on git commit
- ESLint (auto-fix)
- Prettier (auto-format)
- Import sorting
- Unused import removal
```

---

## 🚢 Deployment

Deploy to Vercel or any Next.js-compatible platform:

1. Connect your repository
2. Configure environment variables:
   - `WALTER_BACKEND_API_URL`
   - `WALTER_BACKEND_API_KEY`
3. Deploy!

---

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm lint` and `pnpm format`
4. Ensure pre-commit hooks pass
5. Submit a pull request

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI](https://headlessui.com/)
- [Nivo Charts](https://nivo.rocks/)
- [Plaid Documentation](https://plaid.com/docs/)

---

## 📄 License

This project is proprietary and confidential.

---

**Built with ❤️ by the WalterAI Team**
