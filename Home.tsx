import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import MapView, { Circle, Region } from 'react-native-maps';
import Slider from '@react-native-community/slider'; import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  TextInput,
} from 'react-native';
import * as Location from 'expo-location';

// TODO : tracking
// https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8

export default function App() {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>();
  const [errorMsg, setErrorMsg] = useState<String>('');
  const [scale, setScale] = useState<number>(1.0);

  const updateCurrentLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({});
    if (!!location) {
      if (!!region) {
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: region.latitudeDelta,
          longitudeDelta: region.longitudeDelta,
        });
      } else {
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.04,
        });
      }
    } else {
      setRegion({
        latitude: 37,
        longitude: -122,
        latitudeDelta: 10,
        longitudeDelta: 0.04,
      });
    }
    if (mapRef.current && region) mapRef.current.animateToRegion(region);
  };

  const onRegionChange = (region: Region) => {
    setRegion(region);
  };

  const onValueChange = (value: number) => {
    setScale(value);
  };

  useEffect(() => {
    // updateCurrentLocation();
  });

  return (
    <View style={styles.container}>
      <MapView
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChange={onRegionChange}
        style={styles.mapStyle}
        ref={mapRef}
      >
        <Circle
          center={{
            latitude: region ? region.latitude : 37,
            longitude: region ? region.longitude : -122,
          }}
          radius={scale}
          strokeColor={'#000'}
        />
      </MapView>
      <View style={styles.currentLocationButton}>
        <Button
          title="getCurrentLocation"
          onPress={() => updateCurrentLocation()}
        />
      </View>
      <Slider
        style={styles.scaleBar}
        onValueChange={onValueChange}
        value={scale}
        minimumValue={100}
        maximumValue={10000}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />
      <View style={styles.searchBar}>
        <TextInput placeholder="Course Goal" style={styles.input} />
      </View>
      <StatusBar style="auto" />
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
  scaleBar: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
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
  input: {
    width: '60%',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
  },
});
