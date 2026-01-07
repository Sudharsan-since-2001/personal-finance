Personal Finance / Spend Tracker

A comprehensive personal finance application designed to help you track expenses, visualize spending habits, and review financial decisions. Developed by Sudharsan.

Features

- Dashboard Overview: Get a quick snapshot of your financial health.
- Expense Tracking: Easily log and categorize your daily expenses.
- Detailed Reports: Visualize your spending with interactive charts and graphs using Recharts.
- Regret Review: Analyze past purchases to reflect on spending choices.
- Yearly Wrapped: A fun, end-of-year summary of your financial behaviors.
- Authentication: Secure login and data management powered by Supabase.
- Mobile Ready: Built with mobile-first design and Capacitor for Android deployment.

Tech Stack

- Frontend: React, TypeScript, Vite
- Routing: React Router DOM
- Backend/Auth: Supabase
- Visualization: Recharts
- Mobile Framework: Capacitor (Android)

Run Locally

Prerequisites: Node.js, npm

1. Clone the repository (if applicable)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Mobile Development (Android)

This project uses Capacitor to run as a native Android app.

1. Sync web assets to native project:
   ```bash
   npm run cap:sync
   ```

2. Open in Android Studio:
   ```bash
   npm run cap:open
   ```
