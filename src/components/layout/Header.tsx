'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroContent } from '@/data/content';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Projects', href: '#projects' },
  // { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export function Header(): JSX.Element {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = navItems.map((item) => item.href.slice(1));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.slice(1);
    const element = document.getElementById(targetId);

    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }

    setIsMobileMenuOpen(false);
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setIsMobileMenuOpen(false);
  };

  // Use consistent classes for SSR - only apply scroll-based styles after mount
  const headerPadding = mounted && isScrolled ? 'py-2' : 'py-4';
  const navStyles = mounted && isScrolled ? 'glass-card px-4 py-2' : 'bg-transparent';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerPadding}`}
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className={`relative rounded-2xl transition-all duration-500 ${navStyles}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between h-12 md:h-14">
            {/* Logo / Name */}
            <a
              href="#hero"
              onClick={scrollToTop}
              className="group flex items-center gap-2"
              aria-label="Go to top of page"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-lg">
                {heroContent.name.charAt(0)}
              </div>
              <span className="hidden sm:block text-lg font-bold text-text-primary group-hover:gradient-text transition-all duration-300">
                {heroContent.name.split(' ')[0]}
              </span>
            </a>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      mounted && activeSection === item.href.slice(1)
                        ? 'text-text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                    aria-current={mounted && activeSection === item.href.slice(1) ? 'page' : undefined}
                  >
                    {mounted && activeSection === item.href.slice(1) && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 rounded-xl border border-accent-blue/30"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Theme Toggle & CTA Button */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, '#contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-accent-blue to-accent-purple hover:opacity-90 transition-all duration-300 hover:scale-105"
              >
                <span>Hire Me</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden"
              >
                <ul className="py-4 space-y-1 border-t border-border-subtle mt-2">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => scrollToSection(e, item.href)}
                        className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                          activeSection === item.href.slice(1)
                            ? 'text-text-primary bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 border border-accent-blue/30'
                            : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                        }`}
                        aria-current={activeSection === item.href.slice(1) ? 'page' : undefined}
                      >
                        {item.label}
                      </a>
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                    className="pt-2 flex items-center justify-between gap-3"
                  >
                    <a
                      href="#contact"
                      onClick={(e) => scrollToSection(e, '#contact')}
                      className="flex-1 block px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-accent-blue to-accent-purple text-center"
                    >
                      Hire Me
                    </a>
                    <ThemeToggle />
                  </motion.li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  );
}

export default Header;
