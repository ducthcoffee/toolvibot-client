import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MapView, {Marker, Circle, Region, Callout} from 'react-native-maps';
import {Dimensions} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from './Types';

export interface markerData {
  firstimage: string;
  mapx: number;
  mapy: number;
  title: string;
}

interface MarkerSetProps {
  spotList: markerData[];
  circleRadius: number;
  region: Region;
  navigation: StackScreenProps<RootStackParamList, 'Home'>;
  onMarkerClicked: (query: string) => void;
}

interface RegionSize {
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function MarkerSet(props: MarkerSetProps) {
  const markerList = props.spotList;
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
        initialRegion={{
          latitude: 37.568477,
          longitude: 126.981611,
          latitudeDelta: 0.01,
          longitudeDelta: 0.04,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChange={(region: Region) => {
          setRegionSize({
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
          });
        }}
        style={styles.mapStyle}
        ref={mapRef}>
        <Circle
          center={{
            latitude: props.region ? props.region.latitude : 37,
            longitude: props.region ? props.region.longitude : -122,
          }}
          radius={props.circleRadius}
          strokeColor={'#000'}
        />
        {markerList.length > 0 &&
          markerList.map((marker: markerData) => (
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
              description={marker.title}>
              <Callout>
                <Text>{marker.title}</Text>
              </Callout>
            </Marker>
          ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  currentLocationButton: {
    position: 'absolute',
    top: 50,
    right: 10,
  },
  fetchData: {
    position: 'absolute',
    top: 120,
    right: 10,
  },
  scaleBar: {
    position: 'absolute',
    transform: [{rotate: '-90deg'}],
    width: 200,
    height: 40,
    top: 150,
    left: -50,
  },
  searchBar: {
    width: '80%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 50,
  },
  markerDesc: {
    height: '30%',
    width: '80%',
    position: 'absolute',
    bottom: 0,
  },
  input: {
    width: '60%',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
  },
});
