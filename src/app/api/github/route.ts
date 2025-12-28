import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  stargazers_count: number;
  language: string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Portfolio-Website',
  };

  // Add token if available (increases rate limit from 60 to 5000/hour)
  if (GITHUB_TOKEN) {
    headers.Authorization = `token ${GITHUB_TOKEN}`;
  }

  try {
    // Fetch user data
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers,
      cache: 'no-store',
    });

    if (!userRes.ok) {
      const errorText = await userRes.text();
      console.error('GitHub API error:', userRes.status, errorText);
      
      if (userRes.status === 403) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded' },
          { status: 429 }
        );
      }
      if (userRes.status === 401) {
        return NextResponse.json(
          { error: 'Invalid GitHub token' },
          { status: 401 }
        );
      }
      if (userRes.status === 404) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      throw new Error(`Failed to fetch user: ${userRes.status}`);
    }

    const userData: GitHubUser = await userRes.json();

    // Fetch repos (first 100)
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers, cache: 'no-store' }
    );

    let repos: GitHubRepo[] = [];
    if (reposRes.ok) {
      repos = await reposRes.json();
    }

    // Calculate stats
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    const langCount: Record<string, number> = {};
    repos.forEach((repo) => {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(langCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Fetch contributions from third-party API (doesn't need token)
    // Fetch ALL years to get total contributions
    let totalContributions = 0;
    let currentStreak = 0;
    let longestStreak = 0;

    try {
      // First, fetch all years to get total contributions
      const allYearsRes = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}`,
        { cache: 'no-store' }
      );

      if (allYearsRes.ok) {
        const allYearsData = await allYearsRes.json();
        
        // Sum up contributions from all years
        if (allYearsData.total) {
          totalContributions = Object.values(allYearsData.total as Record<string, number>).reduce(
            (sum: number, count: number) => sum + count,
            0
          );
        }

        // Calculate streaks from all contributions
        if (allYearsData.contributions) {
          const contributions = allYearsData.contributions as { date: string; count: number }[];
          const today = new Date().toISOString().split('T')[0];
          const validContribs = contributions.filter((c) => c.date <= today);

          // Sort by date to ensure correct order
          validContribs.sort((a, b) => a.date.localeCompare(b.date));

          // Current streak (count backwards from today)
          let tempStreak = 0;
          for (let i = validContribs.length - 1; i >= 0; i--) {
            if (validContribs[i].count > 0) {
              tempStreak++;
            } else if (validContribs[i].date !== today) {
              break;
            }
          }
          currentStreak = tempStreak;

          // Longest streak
          let streak = 0;
          for (const c of validContribs) {
            if (c.count > 0) {
              streak++;
              longestStreak = Math.max(longestStreak, streak);
            } else {
              streak = 0;
            }
          }
        }
      }
    } catch {
      // Contribution API failed, continue with zeros
    }

    return NextResponse.json({
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      totalStars,
      topLanguages,
      totalContributions,
      currentStreak,
      longestStreak,
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
