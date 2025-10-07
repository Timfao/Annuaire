import { NewsCard } from '@/components/NewsCard';
import { OfflineBanner } from '@/components/OfflineBanner';
import { useNews } from '@/hooks/useNews';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';

export default function NewsScreen() {
  const router = useRouter();
  const { news, loading, isOffline, refreshNews } = useNews();

  const handleNewsPress = (id: number) => {
    router.push(`../actualite/${id}`);
  };

  if (loading && news.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OfflineBanner visible={isOffline} />
      <FlatList
        data={news}
        renderItem={({ item }) => (
          <NewsCard item={item} onPress={handleNewsPress} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={refreshNews}
            colors={['#2563eb']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  listContent: {
    padding: 16,
  },
});