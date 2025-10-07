import { initDatabase } from '@/services/database.service';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Empêcher le splash screen de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    async function prepare() {
      try {
        // Initialiser la base de données
        await initDatabase();
        console.log('✅ Database initialized');
      } catch (error) {
        console.error('❌ Initialization error:', error);
      } finally {
        // Cacher le splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="actualite/[id]" 
        options={{ 
          title: 'Détail de l\'actualité',
          headerBackTitle: 'Retour'
        }} 
      />
    </Stack>
  );
}