import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const LIBRARY_POI = {
  latitude: 5.290723034123418,
  longitude: -3.9988470009625865
,
  title: 'Bibliothèque ESATIC',
};

export default function CarteScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      // Demander la permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'L\'accès à la localisation est nécessaire pour afficher la carte.'
        );
        setLoading(false);
        return;
      }

      // Récupérer la position
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation(loc);
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Erreur', 'Impossible de récupérer votre position.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#9333ea" />
        <Text style={styles.loadingText}>Récupération de la position...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || LIBRARY_POI.latitude,
          longitude: location?.coords.longitude || LIBRARY_POI.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={LIBRARY_POI}
          title={LIBRARY_POI.title}
          description="Point d'intérêt principal"
          pinColor="#9333ea"
        />
      </MapView>

      {location && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📍 {LIBRARY_POI.title}</Text>
          <Text style={styles.infoCoords}>
            Lat: {LIBRARY_POI.latitude.toFixed(4)}° N
          </Text>
          <Text style={styles.infoCoords}>
            Long: {Math.abs(LIBRARY_POI.longitude).toFixed(4)}° W
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  map: {
    flex: 1,
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  infoCoords: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
});