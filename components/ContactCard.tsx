import { Contact } from '@/types/Contact';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
  const handlePhonePress = () => {
    if (contact.phone) {
      Linking.openURL(`tel:${contact.phone}`);
    }
  };

  const handleEmailPress = () => {
    if (contact.email) {
      Linking.openURL(`mailto:${contact.email}`);
    }
  };

  const handleSmsPress = () => {
    if (contact.phone) {
      Linking.openURL(`sms:${contact.phone}`);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'administration':
        return 'office-building';
      case 'enseignant':
      case 'enseignante':
        return 'school';
      case 'service':
        return 'cog';
      case 'support technique':
        return 'wrench';
      default:
        return 'account';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={getRoleIcon(contact.role)}
            size={24}
            color="#2563eb"
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.role}>{contact.role}</Text>
          <Text style={styles.department}>{contact.department}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        {contact.phone && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePhonePress}
          >
            <MaterialCommunityIcons
              name="phone"
              size={20}
              color="#10b981"
            />
            <Text style={styles.actionText}>Appeler</Text>
          </TouchableOpacity>
        )}

        {contact.phone && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSmsPress}
          >
            <MaterialCommunityIcons
              name="message-text"
              size={20}
              color="#3b82f6"
            />
            <Text style={styles.actionText}>SMS</Text>
          </TouchableOpacity>
        )}

        {contact.email && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEmailPress}
          >
            <MaterialCommunityIcons
              name="email"
              size={20}
              color="#f59e0b"
            />
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  role: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 2,
  },
  department: {
    fontSize: 13,
    color: '#6b7280',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    minWidth: 80,
    justifyContent: 'center',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});
