import { Platform } from 'react-native';
import * as Location from 'expo-location';

/** Coordenadas atuais do usuário, com suporte a web e nativo. */
export async function getCurrentCoords() {
  if (Platform.OS === 'web') {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      throw new Error('Seu navegador não suporta geolocalização.');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        () =>
          reject(
            new Error(
              'Permita o acesso à localização para ver o que está perto.',
            ),
          ),
        { enableHighAccuracy: true, timeout: 12000 },
      );
    });
  }

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error(
      'Permita o acesso à localização para ver o que está perto.',
    );
  }

  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return pos.coords;
}

export default getCurrentCoords;
