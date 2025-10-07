import { useNewsDetail } from '@/hooks/useNewsDetail';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function ActualiteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { news, loading } = useNewsDetail(Number(id));

  const getCategoryColor = (title: string) => {
    if (title?.toLowerCase().includes('rentrée')) return '#10b981';
    if (title?.toLowerCase().includes('portes ouvertes')) return '#f59e0b';
    if (title?.toLowerCase().includes('conférence')) return '#8b5cf6';
    if (title?.toLowerCase().includes('hackathon')) return '#9C9451';
    return '#2563eb';
  };

  const getCategoryIcon = (title: string) => {
    if (title?.toLowerCase().includes('rentrée')) return 'school';
    if (title?.toLowerCase().includes('portes ouvertes')) return 'door-open';
    if (title?.toLowerCase().includes('conférence')) return 'microphone';
    if (title?.toLowerCase().includes('hackathon')) return 'laptop';
    return 'newspaper-variant';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!news) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#9ca3af" />
        <Text style={styles.errorText}>Actualité introuvable</Text>
      </View>
    );
  }

  const categoryColor = getCategoryColor(news.title);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header coloré avec icône */}
      <View style={[styles.header, { backgroundColor: categoryColor }]}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name={getCategoryIcon(news.title)}
            size={32}
            color={categoryColor}
          />
        </View>
      </View>

      {/* Contenu principal */}
      <View style={styles.mainContent}>
        {/* Badge catégorie */}
        <View style={[styles.badge, { backgroundColor: categoryColor + '15' }]}>
          <MaterialCommunityIcons name="tag" size={14} color={categoryColor} />
          <Text style={[styles.badgeText, { color: categoryColor }]}>
            Actualité
          </Text>
        </View>

        {/* Titre */}
        <Text style={styles.title}>{news.title}</Text>

        {/* Informations date et lecture */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="calendar" size={16} color="#6b7280" />
            <Text style={styles.metaText}>{formatDate(news.date)}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#6b7280" />
            <Text style={styles.metaText}>5 min de lecture</Text>
          </View>
        </View>

        {/* Divider décoratif */}
        <View style={[styles.decorativeLine, { backgroundColor: categoryColor }]} />

        {/* Description en avant */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionLabel}>En bref</Text>
          <Text style={styles.description}>{news.description}</Text>
        </View>

        {/* Contenu complet */}
        {news.content && (
          <View style={styles.contentSection}>
            <Text style={styles.contentLabel}>Détails</Text>
            <Text style={styles.bodyText}>{news.content}</Text>
          </View>
        )}

      </View>
    </ScrollView>
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
    gap: 16,
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  mainContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 36,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  decorativeLine: {
    height: 3,
    width: 60,
    borderRadius: 2,
    marginBottom: 24,
  },
  descriptionCard: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  descriptionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    fontWeight: '500',
  },
  contentSection: {
    marginBottom: 24,
  },
  contentLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 28,
    textAlign: 'justify',
  },
  footer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  shareText: {
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '500',
  },
});