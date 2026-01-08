Here’s a more natural, human-written version that reads like a polished project description or README, while keeping everything clear and professional:

---

## Personal Finance / Spend Tracker

Personal Finance is a simple and thoughtful expense-tracking app designed to help you stay aware of your daily spending, identify patterns, and reflect on your financial decisions over time. The app is built and maintained by **Sudharsan**, with a focus on clarity, usability, and long-term financial awareness.

### Features

**Dashboard Overview**
Get a quick snapshot of your overall spending and current financial status at a glance.

**Expense Tracking**
Log daily expenses effortlessly and organize them by category to keep your records clean and meaningful.

**Detailed Reports**
Visualize your spending with interactive charts and graphs powered by Recharts, making it easy to see where your money goes.

**Regret Review**
Revisit past purchases and reflect on spending decisions you wish you had handled differently—designed to encourage smarter future choices.

**Yearly Wrapped**
An end-of-year summary that highlights your spending habits in a fun, insightful way.

**Authentication**
Secure user authentication and data storage handled through Supabase.

**Mobile Ready**
Built with a mobile-first approach and packaged as an Android app using Capacitor.

---

### Tech Stack

* **Frontend:** React, TypeScript, Vite
* **Routing:** React Router DOM
* **Backend & Authentication:** Supabase
* **Charts:** Recharts
* **Mobile:** Capacitor (Android)

---

### Running the Project Locally

#### Prerequisites

* Node.js
* npm

#### Setup Steps

1. Clone the repository (if applicable).
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:

   ```bash
   npm run dev
   ```

---

### Mobile Development (Android)

This project uses Capacitor to run as a native Android application.

1. Sync the web build with the native project:

   ```bash
   npm run cap:sync
   ```
2. Open the project in Android Studio:

   ```bash
   npm run cap:open
   ```

---

If you want, I can also rewrite this to sound more **casual**, **portfolio-focused**, or **startup-style**.
