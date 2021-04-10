import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import MapView, { Marker, Circle, Region, Callout } from 'react-native-maps';
import { markerData, RegionSize } from './Interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './Types';
import { styles } from './MarkerSetStyles';

export interface MarkerSetProps {
  spotList: markerData[];
  circleRadius: number;
  region: Region;
  navigation: StackScreenProps<RootStackParamList, 'Home'>;
  onMarkerClicked: (query: string) => void;
}

export default function MarkerSet(props: MarkerSetProps) {
  const markerList : markerData[] = props.spotList;
  const mapRef = useRef<MapView>(null);
  const [regionSize, setRegionSize] = useState<RegionSize>({
    latitudeDelta: 0.01,
    longitudeDelta: 0.04,
  });

  useEffect(() => {
    if (mapRef.current && props.region) {
      const newRegion: Region = {
        latitude: props.region.latitude,
        longitude: props.region.longitude,
        latitudeDelta: regionSize.latitudeDelta,
        longitudeDelta: regionSize.longitudeDelta,
      };
      mapRef.current.animateToRegion(newRegion);
    }
  }, [props.region]);

  return (
    <View>
      <MapView
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChange={(region: Region) => {
          setRegionSize({
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
          });
        }}
        style={styles.mapStyle}
        ref={mapRef}
      >
        <Circle
          center={{
            latitude: props.region ? props.region.latitude : 37,
            longitude: props.region ? props.region.longitude : -122,
          }}
          radius={props.circleRadius}
          strokeColor={'#000'}
        />
            {markerList && markerList.length > 0 && markerList.map((marker: markerData) => (
          <Marker
            coordinate={{
              latitude: marker.mapy * 1,
              longitude: marker.mapx * 1,
            }}
            key={marker.title}
            onPress={() => {
              props.onMarkerClicked(marker.title);
            }}
            title={marker.title}
            description={marker.title}
          >
            <Callout>
              <Text>{marker.title}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}