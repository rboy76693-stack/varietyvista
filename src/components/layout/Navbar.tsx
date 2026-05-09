'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, User, Heart, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { SearchSuggestions } from './SearchSuggestions';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { getCartCount, setCartOpen } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Collection', href: '/shop?category=denim' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 text-center py-2 text-xs font-bold tracking-[0.2em] uppercase"
        style={{ background: '#0a0a0a', color: '#c8922a', borderBottom: '1px solid #1e1e1e' }}
      >
        ✦ New Collection Dropped — Premium Jeans That Move With You ✦
      </div>

      {/* Main Navbar */}
      <header
        className="fixed left-0 right-0 z-50 transition-all duration-300"
        style={{
          top: '32px',
          background: scrolled ? 'rgba(13,13,13,0.97)' : '#0d0d0d',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #2a2a2a',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <div className="h-[68px] px-4 md:px-10 flex items-center justify-between relative">

          {/* Left: Hamburger (mobile) + Nav links (desktop) */}
          <div className="flex items-center gap-8">
            <button
              suppressHydrationWarning
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1 hover:opacity-70 transition-opacity"
              style={{ color: '#f0ead6' }}
            >
              <Menu className="w-6 h-6" />
            </button>
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium tracking-widest uppercase vv-nav-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Variety Vista Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Gold dot-circle SVG icon */}
              <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="ng" cx="40%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#f5d97a" />
                    <stop offset="50%" stopColor="#c8922a" />
                    <stop offset="100%" stopColor="#8B6010" />
                  </radialGradient>
                </defs>
                <circle cx="18" cy="18" r="5"   fill="url(#ng)" />
                <circle cx="18" cy="10" r="3"   fill="url(#ng)" />
                <circle cx="18" cy="26" r="3"   fill="url(#ng)" />
                <circle cx="10" cy="18" r="3"   fill="url(#ng)" />
                <circle cx="26" cy="18" r="3"   fill="url(#ng)" />
                <circle cx="11.5" cy="11.5" r="2" fill="url(#ng)" opacity="0.85" />
                <circle cx="24.5" cy="11.5" r="2" fill="url(#ng)" opacity="0.85" />
                <circle cx="11.5" cy="24.5" r="2" fill="url(#ng)" opacity="0.85" />
                <circle cx="24.5" cy="24.5" r="2" fill="url(#ng)" opacity="0.85" />
                <circle cx="18"   cy="5"    r="1.5" fill="url(#ng)" opacity="0.6" />
                <circle cx="18"   cy="31"   r="1.5" fill="url(#ng)" opacity="0.6" />
                <circle cx="5"    cy="18"   r="1.5" fill="url(#ng)" opacity="0.6" />
                <circle cx="31"   cy="18"   r="1.5" fill="url(#ng)" opacity="0.6" />
              </svg>
              <span
                className="text-xl font-semibold tracking-wide leading-none hidden sm:block"
                style={{
                  background: 'linear-gradient(135deg, #f5d97a 0%, #c8922a 50%, #8B6010 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Variety vista
              </span>
            </Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-5" style={{ color: '#a09070' }}>
            <SearchSuggestions />
            <Link href="/login" className="hidden md:block hover:opacity-70 transition-opacity">
              <User className="w-5 h-5" />
            </Link>
            <button suppressHydrationWarning className="hidden md:block hover:opacity-70 transition-opacity">
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              suppressHydrationWarning
              className="relative hover:opacity-70 transition-opacity"
            >
              <ShoppingBag className="w-6 h-6" />
              {mounted && getCartCount() > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: '#c8922a', color: '#0d0d0d' }}
                >
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="relative w-72 h-full flex flex-col p-8 gap-8 z-10"
            style={{ background: '#111', borderRight: '1px solid #2a2a2a' }}
          >
            <button
              suppressHydrationWarning
              onClick={() => setMobileOpen(false)}
              className="self-end"
              style={{ color: '#a09070' }}
            >
              <X className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <span className="text-xl font-semibold" style={{ background: 'linear-gradient(135deg, #f5d97a, #c8922a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Variety vista
              </span>
            </Link>
            <nav className="flex flex-col gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-bold uppercase tracking-widest"
                  style={{ color: '#f0ead6' }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
