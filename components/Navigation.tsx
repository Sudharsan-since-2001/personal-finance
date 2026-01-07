
import React from 'react';
import { NavLink } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ThemeToggle from './ThemeToggle';

const Navigation: React.FC = () => {
  const handleSignOut = async () => {
    const confirmed = window.confirm('Are you sure you want to sign out of your Spend Tracker session?');
    if (confirmed) {
      await supabase.auth.signOut();
    }
  };

  const navItems = [
    {
      to: '/', label: 'Payments', icon: (
        <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    },
    {
      to: '/overview', label: 'Overview', icon: (
        <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" /></svg>
      )
    },
    {
      to: '/reports', label: 'Reports', icon: (
        <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      )
    },
    {
      to: '/regret-review', label: 'Regret', icon: (
        <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 7l1 2-2 2 2 2" />
        </svg>
      )
    },
    {
      to: '/wrapped', label: 'Wrapped', icon: (
        <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
        </svg>
      )
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-72 bg-nav-bg backdrop-blur-xl border-r border-border flex-col h-screen sticky top-0 z-50">
        <div className="p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden bg-accent shadow-lg shadow-accent/20 shrink-0">
              <img
                src="/app-logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Spend+Tracker&background=f59e0b&color=fff'; }}
              />
            </div>
            <span className="text-base md:text-lg font-bold tracking-tight text-[var(--text-title)] truncate">Spend Tracker</span>
          </div>
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 flex flex-col px-6 py-4 gap-2">
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4 px-2">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                  ? 'bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/10 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-title)] hover:bg-[var(--accent-muted)]'
                }`
              }
            >
              <div className="group">{item.icon}</div>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 mobile-bottom-nav px-2 py-3 pb-8 flex items-center justify-around border-t border-border shadow-2xl">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-all duration-300 min-w-0 flex-1 ${isActive
                ? 'text-[var(--accent)] scale-105'
                : 'text-[var(--text-muted)]'
              }`
            }
          >
            {item.icon}
            <span className="text-[9px] font-bold uppercase tracking-tight truncate w-full text-center">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleSignOut}
          className="flex flex-col items-center gap-1 text-[var(--text-muted)] hover:text-rose-500 transition-all font-bold min-w-0 flex-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="text-[9px] font-bold uppercase tracking-tight truncate w-full text-center">Exit</span>
        </button>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-6 bg-nav-bg border-b border-border backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-accent">
            <img
              src="/app-logo.jpg"
              alt="User"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Spend+Tracker&background=f59e0b&color=fff'; }}
            />
          </div>
          <span className="text-lg font-bold text-[var(--text-title)] tracking-tight">Spend Tracker</span>
        </div>
        <ThemeToggle />
      </div>
    </>
  );
};

export default Navigation;
