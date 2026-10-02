'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Lock, User, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials. Access denied.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-background bg-grid-subtle selection:bg-accent-green selection:text-black">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO COMMUNITY SITE</span>
          </Link>
        </div>

        {/* Login Box */}
        <div className="border-2 border-white bg-surface p-8 shadow-brutal">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 border-2 border-white bg-black p-1 mx-auto shadow-brutal-sm">
              <Image
                src="https://github.com/CodeNoSekai.png"
                alt="CodeNoSekai"
                width={56}
                height={56}
                className="object-contain"
                unoptimized
              />
            </div>
            <div>
              <div className="inline-block px-2 py-0.5 border border-zinc-700 bg-zinc-900 font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-1">
                RESTRICTED // ADMIN AUTH
              </div>
              <h1 className="font-mono text-2xl font-black uppercase text-white tracking-tight">
                Admin Portal
              </h1>
              <p className="font-sans text-xs text-zinc-400 mt-1">
                Administrative session for inspecting community candidate submissions.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-3 border-2 border-red-500 bg-red-500/10 flex items-center gap-2.5 text-red-300 font-mono text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold"
              >
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Username"
                  className="w-full pl-9 pr-4 py-2.5 bg-background border border-zinc-700 font-mono text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold"
              >
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-background border border-zinc-700 font-mono text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-brutal w-full py-3 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>LOGIN TO DASHBOARD</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-zinc-800 text-center font-mono text-[11px] text-zinc-500">
            SECURE SERVER-SIDE COOKIE AUTHENTICATION
          </div>
        </div>
      </div>
    </div>
  );
}
