'use client';

import { ThemeProvider } from '@/lib/theme-context';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Poker Tournament Manager</title>
        <meta name="description" content="Manage poker tournaments with up to 27 players" />
      </head>
      <body>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white py-4">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">
                    <Link href="/">Poker Tournament Manager</Link>
                  </h1>
                  <nav>
                    <ul className="flex space-x-6">
                      <li>
                        <Link href="/tournaments" className="hover:underline">Tournaments</Link>
                      </li>
                      <li>
                        <Link href="/players" className="hover:underline">Players</Link>
                      </li>
                      <li>
                        <Link href="/settings" className="hover:underline">Settings</Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </header>
            
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            
            <footer className="bg-gray-800 text-white py-4">
              <div className="container mx-auto px-4 text-center">
                &copy; {new Date().getFullYear()} Poker Tournament Manager
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
