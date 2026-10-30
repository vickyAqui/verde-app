import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, {
  Circle,
  Marker,
  Polygon,
  PROVIDER_DEFAULT,
} from 'react-native-maps';

import { CT_CENTER, raioOf } from '../../theme';
import { styles } from './MapStyle';

export default function MapCanvas({
  rows,
  selectedKey,
  onSelect,
  userPos,
  mapRef,
  fitSignal,
}) {
  const prevFit = useRef(0);
  const prevSelected = useRef(null);

  useEffect(() => {
    if (!fitSignal || fitSignal === prevFit.current) return;
    prevFit.current = fitSignal;

    const coords = rows
      .filter((r) => r.lat !== null && r.lng !== null)
      .map((r) => ({ latitude: r.lat, longitude: r.lng }));

    if (userPos) {
      coords.push({ latitude: userPos.lat, longitude: userPos.lng });
    }
    if (coords.length === 0) return;

    mapRef.current?.fitToCoordinates(coords, {
      edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
      animated: true,
    });
  }, [fitSignal, rows, userPos, mapRef]);

  useEffect(() => {
    if (!selectedKey || selectedKey === prevSelected.current) return;
    prevSelected.current = selectedKey;

    const row = rows.find((r) => r.key === selectedKey);
    if (row && row.lat !== null && row.lng !== null) {
      mapRef.current?.animateToRegion(
        {
          latitude: row.lat,
          longitude: row.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500,
      );
    }
  }, [selectedKey, rows, mapRef]);

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      provider={PROVIDER_DEFAULT}
      initialRegion={{
        ...CT_CENTER,
        latitudeDelta: 0.09,
        longitudeDelta: 0.09,
      }}
      showsUserLocation={false}
      showsMyLocationButton={false}
      toolbarEnabled={false}
    >
      {rows.map((row) => {
        const isSelected = row.key === selectedKey;
        const raio = raioOf(row.status, row.raio);
        const fill = `${row.color}${isSelected ? '66' : '3D'}`;
        const center = { latitude: row.lat, longitude: row.lng };

        return (
          <React.Fragment key={row.key}>
            {row.poligono ? (
              <Polygon
                coordinates={row.poligono}
                strokeColor={row.color}
                strokeWidth={isSelected ? 3 : 2}
                fillColor={fill}
                onPress={() => onSelect(row.key)}
              />
            ) : (
              <Circle
                center={center}
                radius={raio}
                strokeColor={row.color}
                strokeWidth={isSelected ? 3 : 2}
                fillColor={fill}
                lineDashPattern={
                  row.kind === 'area' && row.status === 'reflorestada'
                    ? undefined
                    : [6, 4]
                }
                onPress={() => onSelect(row.key)}
              />
            )}

            <Marker
              coordinate={center}
              onPress={() => onSelect(row.key)}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View
                style={[
                  styles.marker,
                  {
                    backgroundColor: row.color,
                    borderWidth: isSelected ? 4 : 3,
                  },
                ]}
              >
                {isSelected ? (
                  <Text style={styles.markerText}>✓</Text>
                ) : row.kind === 'denuncia' ? (
                  <Text style={styles.markerText}>!</Text>
                ) : (
                  <View style={styles.markerLeaf} />
                )}
              </View>
            </Marker>
          </React.Fragment>
        );
      })}

      {userPos && (
        <>
          <Circle
            center={{ latitude: userPos.lat, longitude: userPos.lng }}
            radius={1800}
            strokeColor="#2563EB"
            strokeWidth={1.5}
            fillColor="rgba(37,99,235,0.08)"
          />
          <Marker
            coordinate={{ latitude: userPos.lat, longitude: userPos.lng }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.userMarker} />
          </Marker>
        </>
      )}
    </MapView>
  );
}
