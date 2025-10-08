import { saveReport } from '@/services/database.service';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SignalerScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [category, setCategory] = useState<string>('general');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    // Rationale avant demande de permission
    Alert.alert(
      'Localisation',
      'Nous avons besoin de votre position pour géolocaliser le signalement.',
      [
        {
          text: 'Continuer',
          onPress: async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
              const loc = await Location.getCurrentPositionAsync({});
              setLocation(loc);
            } else {
              Alert.alert('Permission refusée', 'Vous pourrez l’autoriser plus tard dans les réglages.');
            }
          },
        },
      ]
    );
  };

  const handleTakePhoto = async () => {
    // Rationale
    Alert.alert('Caméra', 'Autorisez l’appareil photo pour joindre une photo au signalement.', [
      {
        text: 'Continuer',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission requise', 'L\'accès à la caméra est nécessaire.');
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
          });

          if (!result.canceled) {
            // Compression WebP
            const manipulated = await ImageManipulator.manipulateAsync(
              result.assets[0].uri,
              [{ resize: { width: 1280 } }], // limite largeur
              { compress: 0.7, format: ImageManipulator.SaveFormat.WEBP }
            );
            setMediaUri(manipulated.uri);
            setMediaType('photo');
          }
        },
      },
    ]);
  };

  const handleTakeVideo = async () => {
    Alert.alert('Caméra', 'Autorisez l’appareil photo pour joindre une vidéo (≤ 30s).', [
      {
        text: 'Continuer',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission requise', 'L\'accès à la caméra est nécessaire.');
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            videoMaxDuration: 30,
            quality: 0.8,
          });

          if (!result.canceled) {
            setMediaUri(result.assets[0].uri);
            setMediaType('video');
          }
        },
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }

    if (!location) {
      Alert.alert('Localisation requise', 'Impossible de récupérer votre position.');
      return;
    }

    setSubmitting(true);

    try {
      await saveReport({
        title: title.trim(),
        description: description.trim(),
        category,
        mediaPath: mediaUri || undefined,
        mediaType: mediaType || undefined,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        createdAt: new Date(),
      });

      Alert.alert('Succès', 'Votre signalement a été enregistré.', [
        {
          text: 'OK',
          onPress: () => {
            setTitle('');
            setDescription('');
            setMediaUri(null);
            setMediaType(null);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'enregistrer le signalement.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.inputGroup} accessibilityLabel="champ-titre">
        <Text style={styles.label}>Titre *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Lampe défectueuse"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          accessibilityLabel="Entrer le titre du signalement"
        />
      </View>

      <View style={styles.inputGroup} accessibilityLabel="champ-description">
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Décrivez l'incident..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          maxLength={500}
          accessibilityLabel="Entrer la description du signalement"
        />
      </View>

      

      <View style={styles.mediaButtons}>
        <TouchableOpacity style={styles.mediaButton} onPress={handleTakePhoto} accessibilityLabel="Prendre une photo">
          <MaterialCommunityIcons name="camera" size={32} color="#6b7280" />
          <Text style={styles.mediaButtonText}>Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mediaButton} onPress={handleTakeVideo} accessibilityLabel="Enregistrer une vidéo">
          <MaterialCommunityIcons name="video" size={32} color="#6b7280" />
          <Text style={styles.mediaButtonText}>Vidéo (≤30s)</Text>
        </TouchableOpacity>
      </View>

      {mediaUri && (
        <View style={styles.mediaPreview}>
          {mediaType === 'photo' && (
            <Image source={{ uri: mediaUri }} style={styles.previewImage} />
          )}
          {mediaType === 'video' && (
            <Video
              source={{ uri: mediaUri }}
              style={styles.previewVideo}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={false}
              isLooping={false}
            />
          )}
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              setMediaUri(null);
              setMediaType(null);
            }}
          >
            <MaterialCommunityIcons name="close-circle" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
      )}

      {location && (
        <View style={styles.locationCard}>
          <MaterialCommunityIcons name="map-marker" size={24} color="#3b82f6" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Géolocalisation</Text>
            <Text style={styles.locationCoords}>
              {location.coords.latitude.toFixed(4)}°, {location.coords.longitude.toFixed(4)}°
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
        accessibilityLabel="Envoyer le signalement"
      >
        <Text style={styles.submitButtonText}>
          {submitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  mediaButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  mediaButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  mediaPreview: {
    marginBottom: 16,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  previewVideo: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  locationCard: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  locationInfo: {
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  locationCoords: {
    fontSize: 12,
    color: '#1e40af',
    marginTop: 4,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipActive: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  categoryText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#b91c1c',
  },
  submitButton: {
    backgroundColor: '#ea580c',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});