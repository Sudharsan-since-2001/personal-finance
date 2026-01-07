Personal Finance / Spend Tracker

A personal finance app built to track daily expenses, understand spending patterns, and reflect on financial decisions over time.
Built and maintained by Sudharsan.

Features

Dashboard Overview
A simple snapshot of your overall spending and financial status.

Expense Tracking
Log daily expenses and organize them by category with ease.

Detailed Reports
Interactive charts and graphs (powered by Recharts) to clearly understand where your money goes.

Regret Review
Look back at past purchases and analyze spending decisions you wish you had made differently.

Yearly Wrapped
An end-of-year summary that highlights your spending habits in a fun and meaningful way.

Authentication
Secure user authentication and data storage using Supabase.

Mobile Ready
Designed with a mobile-first approach and packaged as an Android app using Capacitor.

Tech Stack

Frontend: React, TypeScript, Vite

Routing: React Router DOM

Backend & Auth: Supabase

Charts: Recharts

Mobile: Capacitor (Android)

Run Locally
Prerequisites

Node.js

npm

Steps

Clone the repository (if applicable)

Install dependencies:

npm install


Environment setup:
Create a .env.local file in the root directory and add your Supabase credentials:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


Start the development server:

npm run dev

Mobile Development (Android)

This project uses Capacitor to run as a native Android application.

Sync the web build with the native project:

npm run cap:sync


Open the project in Android Studio:

npm run cap:open