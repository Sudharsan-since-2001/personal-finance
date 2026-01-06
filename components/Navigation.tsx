
import React from 'react';
import { NavLink } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Navigation: React.FC = () => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    {
      to: '/', label: 'Overview', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" /></svg>
      )
    },
    {
      to: '/expenses', label: 'Payments', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    },
    {
      to: '/reports', label: 'Reports', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      )
    },
  ];

  return (
    <nav className="w-full md:w-72 bg-[#0f0f0f] border-b md:border-b-0 md:border-r border-white/5 flex flex-row md:flex-col h-auto md:h-screen sticky top-0 z-50">
      <div className="p-8 hidden md:flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-500/20 shadow-lg shadow-amber-500/10 bg-amber-400">
          <img
            src="/app-logo.jpg"
            alt="User Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Spend Tracker</span>
      </div>

      <div className="flex-1 flex flex-row md:flex-col items-center md:items-stretch px-4 md:px-6 py-4 gap-2">
        <p className="hidden md:block text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4 px-2">Main Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap w-full ${isActive
                ? 'bg-white/5 text-amber-500 border border-white/10 shadow-xl'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-6 border-t border-white/5 hidden md:block">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Sign Out
        </button>
      </div>

      {/* Mobile Top Bar Logo */}
      <div className="md:hidden flex items-center p-4">
        <div className="w-8 h-8 rounded-lg overflow-hidden mr-3 bg-amber-400">
          <img src="/app-logo.jpg" alt="User" className="w-full h-full object-cover" />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
