
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ExpensesPage from './pages/ExpensesPage';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f]">
        <div className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-500 font-medium tracking-widest text-xs uppercase">Spend Tracker</p>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#0f0f0f] text-zinc-100 flex flex-col md:flex-row">
        {session && <Navigation />}
        <main className={`flex-1 overflow-y-auto ${session ? 'p-4 md:p-10' : ''}`}>
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route 
                path="/login" 
                element={!session ? <Login /> : <Navigate to="/" />} 
              />
              <Route 
                path="/" 
                element={session ? <Dashboard user={session.user} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/expenses" 
                element={session ? <ExpensesPage user={session.user} /> : <Navigate to="/login" />} 
              />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
