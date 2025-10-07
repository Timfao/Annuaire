import { News } from '@/types/News';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface NewsCardProps {
  item: News;
  onPress: (id: number) => void;
}

export function NewsCard({ item, onPress }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getCategoryIcon = (title: string) => {
    if (title.toLowerCase().includes('rentrée')) {
      return 'school';
    } else if (title.toLowerCase().includes('portes ouvertes')) {
      return 'door-open';
    } else if (title.toLowerCase().includes('conférence')) {
      return 'microphone';
    }else if(title.toLocaleLowerCase().includes('hackathon')){
      return 'laptop';
    } else {
      return 'newspaper-variant';
    }
  };

  const getCategoryColor = (title: string) => {
    if (title.toLowerCase().includes('rentrée')) {
      return '#10b981';
    } else if (title.toLowerCase().includes('portes ouvertes')) {
      return '#f59e0b';
    } else if (title.toLowerCase().includes('conférence')) {
      return '#8b5cf6';
    } else if (title.toLowerCase().includes('hackathon')) {
      return '#F5E427';
    } else {
      return '#2563eb';
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(item.title) + '20' }]}>
          <MaterialCommunityIcons
            name={getCategoryIcon(item.title)}
            size={20}
            color={getCategoryColor(item.title)}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.date}>
            {formatDate(item.date)}
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color="#9ca3af"
        />
      </View>
      
      <Text style={styles.description} numberOfLines={3}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 22,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
});
