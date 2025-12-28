'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, reducedMotionVariants } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  topLanguages: { name: string; count: number }[];
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  lastUpdated: string;
}

interface GitHubActivityProps {
  username: string;
}

export function GitHubActivity({ username }: GitHubActivityProps): JSX.Element {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : fadeInUp;

  const fetchGitHubData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // Use our API route which handles rate limiting better
      const res = await fetch(`/api/github?username=${username}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 429) {
          throw new Error('GitHub API rate limit exceeded. Try again later.');
        }
        throw new Error(data.error || 'Failed to fetch data');
      }

      const data = await res.json();

      setStats({
        publicRepos: data.publicRepos,
        followers: data.followers,
        following: data.following,
        totalStars: data.totalStars,
        topLanguages: data.topLanguages,
        totalContributions: data.totalContributions,
        currentStreak: data.currentStreak,
        longestStreak: data.longestStreak,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Check your connection.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      }
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchGitHubData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchGitHubData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchGitHubData]);

  if (loading) {
    return (
      <div className="mt-10 p-6 glass-card rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-text-secondary">Loading GitHub activity...</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mt-10 p-6 glass-card rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">GitHub Activity</h3>
            <p className="text-sm text-text-muted">{error || 'Unable to load data'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchGitHubData}
            className="px-4 py-2 rounded-xl glass-card text-accent-blue hover:text-accent-cyan text-sm font-medium transition-colors"
          >
            Try again
          </button>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl glass-card text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    );
  }

  // Add timestamp to bust cache for contribution graph
  const timestamp = Date.now();
  const graphUrl = `https://ghchart.rshah.org/10b981/${username}?t=${timestamp}`;

  return (
    <motion.div className="mt-10" variants={variants} initial="hidden" animate="visible">
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <Header username={username} onRefresh={fetchGitHubData} />
        <ContributionGraph url={graphUrl} username={username} />
        <StatsGrid stats={stats} />
        <TopLanguages languages={stats.topLanguages} />
      </div>
    </motion.div>
  );
}

function Header({ username, onRefresh }: { username: string; onRefresh: () => void }) {
  const profileUrl = 'https://github.com/' + username;
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">GitHub Activity</h3>
          <p className="text-sm text-text-muted">Real-time contribution data</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="p-2 rounded-lg glass-card text-text-muted hover:text-accent-cyan transition-colors"
          title="Refresh data"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-sm text-accent-blue hover:text-accent-cyan transition-colors"
        >
          @{username}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function ContributionGraph({ url, username }: { url: string; username: string }) {
  const altText = username + ' contributions';
  return (
    <div className="mb-8 p-4 rounded-xl bg-bg-tertiary/50 border border-border-subtle overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={altText} className="w-full h-auto rounded-lg" loading="lazy" />
      <div className="flex items-center justify-end mt-3 gap-1.5 text-xs text-text-muted">
        <span>Less</span>
        {['bg-bg-tertiary', 'bg-green-900/50', 'bg-green-700/70', 'bg-green-500/80', 'bg-green-400'].map((bg, i) => (
          <div key={i} className={`w-3 h-3 rounded ${bg}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

function StatsGrid({ stats }: { stats: GitHubStats }) {
  const mainStats = [
    { label: 'Total Contributions', value: stats.totalContributions, icon: '🔥', gradient: 'from-orange-500 to-red-500' },
    { label: 'Current Streak', value: stats.currentStreak, suffix: ' days', icon: '⚡', gradient: 'from-yellow-500 to-orange-500' },
    { label: 'Longest Streak', value: stats.longestStreak, suffix: ' days', icon: '🏆', gradient: 'from-accent-blue to-accent-purple' },
  ];

  const secondaryStats = [
    { label: 'Repositories', value: stats.publicRepos },
    { label: 'Stars', value: stats.totalStars },
    { label: 'Followers', value: stats.followers },
    { label: 'Following', value: stats.following },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Main stats */}
      <div className="grid grid-cols-3 gap-3">
        {mainStats.map((stat, index) => (
          <div key={index} className="relative group">
            <div className={`absolute -inset-[1px] bg-gradient-to-r ${stat.gradient} rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300`} />
            <div className="relative text-center p-4 rounded-xl bg-bg-tertiary/50 border border-border-subtle">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-bold gradient-text">
                {stat.value.toLocaleString()}
                {stat.suffix && <span className="text-sm font-normal text-text-muted">{stat.suffix}</span>}
              </div>
              <div className="text-xs text-text-muted mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {secondaryStats.map((stat, index) => (
          <div key={index} className="text-center p-3 rounded-xl bg-bg-tertiary/30 border border-border-subtle">
            <div className="text-xl font-bold text-text-primary">{stat.value.toLocaleString()}</div>
            <div className="text-xs text-text-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopLanguages({ languages }: { languages: { name: string; count: number }[] }) {
  if (languages.length === 0) return null;
  
  const colors: Record<string, string> = {
    JavaScript: 'bg-yellow-500',
    TypeScript: 'bg-blue-500',
    Python: 'bg-green-500',
    Java: 'bg-red-500',
    Go: 'bg-cyan-500',
    Rust: 'bg-orange-500',
    Ruby: 'bg-red-400',
    PHP: 'bg-purple-500',
    C: 'bg-gray-500',
    'C++': 'bg-pink-500',
    'C#': 'bg-green-600',
    Swift: 'bg-orange-400',
    Kotlin: 'bg-purple-400',
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        Top Languages
      </h4>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <span
            key={lang.name}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-bg-tertiary/50 text-text-primary rounded-lg border border-border-subtle"
          >
            <span className={`w-2 h-2 rounded-full ${colors[lang.name] || 'bg-accent-blue'}`} />
            {lang.name}
            <span className="text-text-muted">({lang.count})</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default GitHubActivity;
