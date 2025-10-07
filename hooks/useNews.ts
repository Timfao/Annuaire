import { fetchNews } from '@/services/api.service';
import { getNews as getCachedNews, insertNews } from '@/services/database.service';
import { News } from '@/types/News';
import { useEffect, useState } from 'react';

export const useNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      
      // Essayer de charger depuis l'API
      const apiNews = await fetchNews();
      setNews(apiNews);
      setIsOffline(false);
      
      // Mettre en cache
      await insertNews(apiNews);
    } catch (error) {
      console.error('Error fetching news:', error);
      
      // Charger depuis le cache
      try {
        const cachedNews = await getCachedNews();
        setNews(cachedNews);
        setIsOffline(true);
      } catch (cacheError) {
        console.error('Error loading cached news:', cacheError);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = async () => {
    await loadNews();
  };

  return {
    news,
    loading,
    isOffline,
    refreshNews,
  };
};