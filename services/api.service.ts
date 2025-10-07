import { getContacts, getNews, insertContacts, insertNews } from '@/services/database.service';
import { Contact } from '@/types/Contact';
import { News } from '@/types/News';
import axios, { AxiosInstance } from 'axios';
import * as Network from 'expo-network';

// ✅ URL MockAPI
const API_BASE_URL = 'https://68e430d28e116898997b3b70.mockapi.io';
const API_TIMEOUT = 10000;

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // 🔹 Vérifie la connexion Internet
  private async isOnline(): Promise<boolean> {
    try {
      const { isConnected } = await Network.getNetworkStateAsync();
      return !!isConnected;
    } catch (error) {
      console.warn('⚠️ Impossible de vérifier la connexion:', error);
      return false;
    }
  }

  // 📰 Récupération des actualités (en ligne + hors ligne)
  async fetchNews(): Promise<News[]> {
    try {
      const online = await this.isOnline();
      if (online) {
        console.log('🌍 Mode en ligne - Chargement des actualités depuis MockAPI...');
        const response = await this.client.get('/news');
        const news = response.data;

        // 🧠 Mise en cache local
        await insertNews(news);
        console.log('✅ Actualités mises en cache');
        return news;
      } else {
        console.log('📴 Mode hors ligne - Chargement des actualités locales');
        return await getNews();
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des actualités:', error);
      console.log('🔄 Récupération depuis le cache local...');
      return await getNews();
    }
  }

  // 📞 Récupération des contacts (en ligne + hors ligne)
  async fetchContacts(): Promise<Contact[]> {
    try {
      const online = await this.isOnline();
      if (online) {
        console.log('🌍 Mode en ligne - Chargement des contacts depuis MockAPI...');
        const response = await this.client.get('/contact');
        const contacts = response.data;

        // 🧠 Mise en cache local
        await insertContacts(contacts);
        console.log('✅ Contacts mis en cache');
        return contacts;
      } else {
        console.log('📴 Mode hors ligne - Chargement des contacts locaux');
        return await getContacts();
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des contacts:', error);
      console.log('🔄 Récupération depuis le cache local...');
      return await getContacts();
    }
  }
}

export const apiService = new ApiService();
export const fetchNews = () => apiService.fetchNews();
export const fetchContacts = () => apiService.fetchContacts();