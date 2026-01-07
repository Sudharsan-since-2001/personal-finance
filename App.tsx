import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';
import RegretReviewPage from './pages/RegretReviewPage';
import YearlyWrappedPage from './pages/YearlyWrappedPage';
import Navigation from './components/Navigation';
import { ThemeProvider } from './context/ThemeContext';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Forced splash delay for branding
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  if (loading || showSplash) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] text-white">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl animate-pulse">💰</span>
          </div>
        </div>
        <div className="mt-8 text-center animate-in fade-in zoom-in duration-1000">
          <p className="text-zinc-500 font-bold tracking-[0.3em] text-[10px] uppercase mb-1">Spend Tracker</p>
          <div className="h-[1px] w-12 bg-amber-500/20 mx-auto mb-4"></div>
          <p className="text-white/80 font-medium tracking-wide text-xs">Developed by <span className="text-amber-500 font-bold">Sudharsan</span></p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <HashRouter>
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col md:flex-row transition-colors duration-300 select-none touch-pan-y">
          {session && <Navigation />}
          <main className={`flex-1 overflow-y-auto ${session ? 'p-6 md:p-10 pb-32 md:pb-10' : ''}`}>
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route
                  path="/login"
                  element={!session ? <Login /> : <Navigate to="/" />}
                />
                <Route
                  path="/"
                  element={session ? <ExpensesPage user={session.user} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/overview"
                  element={session ? <Dashboard user={session.user} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/reports"
                  element={session ? <ReportsPage user={session.user} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/regret-review"
                  element={session ? <RegretReviewPage user={session.user} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/wrapped"
                  element={session ? <YearlyWrappedPage user={session.user} /> : <Navigate to="/login" />}
                />
              </Routes>
            </div>
          </main>
        </div>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
