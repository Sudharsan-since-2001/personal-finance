Personal Finance / Spend Tracker

Personal Finance is a clean and intuitive expense tracking application built to help users understand their spending habits, track daily expenses, and make better financial decisions over time. The focus is on simplicity, clarity, and long-term awareness rather than complex financial jargon.

The project is designed, built, and maintained by Sudharsan, with an emphasis on usability and practical personal finance insights.

Key Features:

Dashboard Overview
A clear snapshot of your current financial status, showing total spending and key trends at a glance.

Expense Tracking
Quickly log daily expenses and organize them into meaningful categories for better clarity.

Detailed Reports
Interactive charts and visual reports powered by Recharts help you understand where your money is going.

Regret Review
A reflective feature that lets you review past purchases and mark expenses you wish you had avoided, encouraging smarter future spending.

Yearly Wrapped
An annual summary that highlights spending patterns and habits in a simple, engaging format.

Authentication
Secure user authentication and data management handled through Supabase.

Mobile Ready
Built with a mobile-first approach and packaged as an Android application using Capacitor.

Tech Stack

Frontend: React, TypeScript, Vite

Routing: React Router DOM

Backend & Authentication: Supabase

Charts: Recharts

Mobile: Capacitor (Android)

Running the Project Locally
Prerequisites

Node.js

npm

Setup

Clone the repository.

Install dependencies:

npm install


Create a .env.local file in the root directory and add your Supabase credentials:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


Start the development server:

npm run dev

Mobile Development (Android)

This project uses Capacitor to run as a native Android application.

Sync the web build with the native Android project:

npm run cap:sync


Open the project in Android Studio:

npm run cap:open
