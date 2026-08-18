import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import api from '../../api';

const { width } = Dimensions.get('window');

export default function MapScreen() {
  const [areas, setAreas] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getCurrentLocation();
    loadAreas();
  }, []);

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    }
  };

  const loadAreas = async () => {
    try {
      const response = await api.get('/areas');
      setAreas(response.data.areas);
    } catch (err) {
      console.error(err);
    }
  };

  const getMarkerColor = (status) => {
    const colors = { identified: '#F59E0B', in_progress: '#3B82F6', reforested: '#10B981' };
    return colors[status] || '#6B7280';
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || -15.7801,
          longitude: location?.longitude || -47.9292,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
      >
        {areas.map((area) => (
          <Marker
            key={area.id}
            coordinate={{ latitude: parseFloat(area.latitude), longitude: parseFloat(area.longitude) }}
            title={area.name}
            description={area.description}
            pinColor={getMarkerColor(area.status)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height: '100%' },
});
