'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { BookOpen, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAuth = pathname === '/login' || pathname === '/signup';

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900">AI Training Platform</span>
              <span className="text-xs text-slate-600">Public Sector</span>
            </div>
          </Link>
          
          {isDashboard ? (
            <nav className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="ghost" 
                size="sm" 
                className="text-slate-700 hover:text-slate-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </nav>
          ) : !isAuth && (
            <nav className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
