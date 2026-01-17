import { NextResponse } from 'next/server';
import type { Blog } from '@/types';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Dev.to API article response shape (snake_case)
 */
interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image: string | null;
  social_image: string | null;
  published_at: string;
  reading_time_minutes: number;
  tag_list: string[];
}

/**
 * Transform dev.to API response from snake_case to camelCase Blog type
 */
function transformArticle(article: DevToArticle): Blog {
  return {
    id: article.id,
    title: article.title,
    description: article.description,
    url: article.url,
    coverImage: article.cover_image,
    socialImage: article.social_image,
    publishedAt: article.published_at,
    readingTimeMinutes: article.reading_time_minutes,
    tags: article.tag_list,
  };
}

/**
 * GET handler for fetching dev.to articles
 * Requirements: 3.1, 3.4, 3.5
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  const headers: HeadersInit = {
    Accept: 'application/json',
    'User-Agent': 'Portfolio-Website',
  };

  try {
    // Fetch latest 3 articles from dev.to API with cache busting
    const timestamp = Date.now();
    const response = await fetch(
      `https://dev.to/api/articles?username=${encodeURIComponent(username)}&per_page=3&_t=${timestamp}`,
      {
        headers,
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dev.to API error:', response.status, errorText);

      if (response.status === 404) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        );
      }
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    const articles: DevToArticle[] = await response.json();
    
    console.log('Dev.to API returned articles:', articles.length);
    articles.forEach((a, i) => console.log(`Article ${i}: ${a.title}`));

    // Transform snake_case to camelCase and limit to 3 articles
    const blogs: Blog[] = articles.slice(0, 3).map(transformArticle);
    
    console.log('Transformed blogs:', blogs.length);

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Dev.to API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
