import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker, Circle, Region } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  TextInput,
} from 'react-native';
import * as Location from 'expo-location';
import { instance } from './Spots';
import MarkerSet, { markerData } from './MarkerSet';

// TODO : tracking
// https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8

const API_KEY =
  'b3MDk9GG2y%2F7LTEc1SUKuzf0UFkIYt9WKGt7NPvzoNIEmgADmAgLtuMB2OXEnn9pPGi3geex6Nm22mzqUH6HPA%3D%3D';

interface Response {
  data: {
    response: {
      body: {
        items: {
          item: markerData[];
        };
      };
    };
  };
}

export default function App() {
  const [region, setRegion] = useState<Region>({
    latitude: 37,
    longitude: -122,
    latitudeDelta: 10,
    longitudeDelta: 0.04,
  });
  const [errorMsg, setErrorMsg] = useState<String>('');
  const [scale, setScale] = useState<number>(100);
  const [spotList, setSpotList] = useState<markerData[]>([]);

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
  };

  const fetchData = () => {
    instance
      .get(`/locationBasedList`, {
        params: {
          serviceKey: API_KEY,
          numOfRows: 10,
          pageNo: 1,
          MobileOS: 'ETC',
          MobileApp: 'AppTest',
          listYN: 'Y',
          arrange: 'A',
          contentTypeId: 76,
          mapX: region.longitude,
          mapY: region.latitude,
          radius: 1000,
        },
      })
      .then((response: Response) => {
        //console.log(response);
        //console.log(response.data.response.body.items.item);
        setSpotList(response.data.response.body.items.item);
      })
      .catch((error: Error) => {
        console.error(error);
        console.error('cannot get markers');
      });
  };

  const onValueChange = (value: number) => {
    setScale(value);
  };

  return (
    <View style={styles.container}>
      <MarkerSet spotList={spotList} circleRadius={scale} region={region} />
      <View style={styles.currentLocationButton}>
        <Button
          title="getCurrentLocation"
          onPress={() => updateCurrentLocation()}
        />
      </View>
      <View style={styles.fetchData}>
        <Button
          title="updateMarker"
          onPress={() => {
            fetchData();
          }}
        />
      </View>
      <Slider
        style={styles.scaleBar}
        onValueChange={onValueChange}
        value={scale}
        minimumValue={100}
        maximumValue={1000}
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
  fetchData: {
    position: 'absolute',
    top: 70,
    right: 10,
  },
  scaleBar: {
    position: 'absolute',
    transform: [{ rotate: '270deg' }],
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
