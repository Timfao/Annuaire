import { getNewsById } from '@/services/database.service';
import { News } from '@/types/News';
import { useEffect, useState } from 'react';

export const useNewsDetail = (id: number) => {
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, [id]);

  const loadNews = async () => {
    try {
      const newsItem = await getNewsById(id);
      setNews(newsItem);
    } catch (error) {
      console.error('Error loading news detail:', error);
    } finally {
      setLoading(false);
    }
  };

  return { news, loading };
};