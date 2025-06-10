
# ContAI Accounting App

ContAI Accounting is a modern, frontend application designed to help ContAI manage their financial transactions efficiently. It allows users to register accounting entries (credits and debits) and view them in an organized table, grouped by month and year.

## Features

- **Transaction Registration:**
  - Input fields for Date, Description, Amount, and Type (Credit/Debit).
  - Date validation (DD/MM/YYYY format).
  - Amount validation (must be a positive number).
  - Type validation (must be 'Credit' or 'Debit').
- **Transaction Visualization:**
  - Displays all registered transactions in a table.
  - Table is organized by month and year.
  - Each row shows Date, Description, Amount, and Type.
  - Monthly totals for credits and debits are displayed.
- **Data Persistence:**
  - Transactions are saved in the browser's localStorage.
- **Edit and Delete:**
  - Ability to edit existing transactions.
  - Ability to delete transactions.
- **User Experience:**
  - Clean, modern UI with a gradient background and glassmorphism effects.
  - Responsive design for various screen sizes.
  - Toast notifications for user actions (add, update, delete).
  - Smooth animations using Framer Motion.

## Tech Stack

- **Frontend:**
  - React 18.2.0
  - Vite (Build Tool)
  - TailwindCSS 3.3.2 (Styling)
  - shadcn/ui (UI Components)
  - Lucide React (Icons)
  - Framer Motion (Animations)
  - React Hook Form & Zod (Form Handling and Validation)
  - date-fns (Date utility)
- **Language:** JavaScript (.jsx for components, .js for utilities)

## Getting Started

### Prerequisites

- Node.js (version 20 or higher recommended)
- npm (comes with Node.js)

### Running the Application

1.  **Clone the repository (if applicable) or ensure all files are in a project directory.**
2.  **Install dependencies:**
    The environment handles `npm install` automatically when `package.json` is created or updated.
3.  **Run the development server:**
    The environment runs `npm run dev` automatically.
    The application will be accessible at a local URL provided by the development server (typically `http://localhost:5173` or similar).

## Project Structure

```
contabil-app/
├── public/
│   └── ... (public assets)
├── src/
│   ├── components/
│   │   ├── ui/ (shadcn/ui components: Button, Card, Input, Label, Select, Table, Toast, Toaster)
│   │   └── AccountingDashboard.jsx (Main logic for the accounting app)
│   ├── lib/
│   │   └── utils.js (Utility functions like cn)
│   ├── App.jsx (Main application component)
│   ├── index.css (Global styles and TailwindCSS setup)
│   ├── main.jsx (Application entry point)
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── vite.config.js
```

## Key Concepts Used

- **React Components:** The UI is built using functional React components.
- **State Management:** `useState` and `useEffect` hooks are used for managing component state and side effects (like localStorage interaction).
- **Form Handling:** `react-hook-form` is used for efficient form management and validation, integrated with `zod` for schema-based validation.
- **Styling:** TailwindCSS is used for utility-first CSS. shadcn/ui components provide pre-styled building blocks.
- **Data Persistence:** `localStorage` is used for storing transaction data on the client-side.
- **Date Manipulation:** `date-fns` library is used for parsing, formatting, and validating dates.
- **Modularity:** The application is structured into reusable components. The main application logic is encapsulated within `AccountingDashboard.jsx`.
- **User Feedback:** Toast notifications provide feedback for user actions.
- **Responsive Design:** TailwindCSS utility classes are used to ensure the application looks good on different screen sizes.
- **Animations:** Framer Motion is used for subtle UI animations to enhance user experience.

## Future Enhancements (Potential)

-   Backend integration with Express, TypeScript, TypeORM, and PostgreSQL as per the original full-stack requirement.
-   User authentication.
-   Cloud-based data storage (e.g., Supabase).
-   Advanced reporting and data visualization features.
-   Data export/import functionality.
