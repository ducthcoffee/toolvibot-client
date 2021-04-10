import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
} from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';
import Slider from '@react-native-community/slider';
import { Region } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';

import { markerData, Response } from './Interfaces';
import { RootStackParamList } from './Types';
import styles, {icon, slider} from './HomeStyles';
import { API_KEY, DEFAULT_LOCATIOIN, DEFAULT_SCALE, RADIUS_MAX, RADIUS_MIN } from './Config';

import { instance, instanceKor } from './Utils/HttpRequest';
import { clearLocationData, storeLocationData } from './Utils/LocationData';

import MarkerSet from './MarkerSet';
import startScheduler from './Scheduler';


interface Props {
  navigation: StackScreenProps<RootStackParamList, 'Home'>;
}

export default function Home({ navigation }: Props) {
  const [region, setRegion] = useState<Region>(DEFAULT_LOCATIOIN);
  const [errorMsg, setErrorMsg] = useState<String>('');
  const [scale, setScale] = useState<number>(DEFAULT_SCALE);
  const [spotList, setSpotList] = useState<markerData[]>([]);
  const [markerQuery, setMarkerQuery] = useState<string>('');

  useEffect(() => {
    console.log("work only once !!!");
    updateCurrentLocation();
    clearLocationData();
    startScheduler();
  }, []);

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
      setRegion(DEFAULT_LOCATIOIN);
    }
  };

  const fetchData = () => {
    instanceKor
      .get(`/locationBasedList`, {
        params: {
          serviceKey: API_KEY,
          numOfRows: 10,
          pageNo: 1,
          MobileOS: 'ETC',
          MobileApp: 'AppTest',
          arrange: 'A',
          contentTypeId: 12,
          mapX: region.longitude,
          mapY: region.latitude,
          radius: scale,
          listYN: 'Y',
        },
      })
      .then((response: Response) => {
        console.log(response);
        const newMarkerSet : markerData[]= (response.data.response.body.items.item as markerData[]);
        if (!newMarkerSet)
          return;
        setSpotList(newMarkerSet);
        newMarkerSet.map((value: markerData) => {
          storeLocationData(value);
        });
      })
      .catch((error: Error) => {
        console.error(error);
        console.error('cannot get markers');
      });
  };

  const onValueChange = (value: number) => {
    setScale(Math.round(value));
  };

  const showMarkerDesc = (query: string) => {
    setMarkerQuery(query);
  };

  const searchMarker = () => {
    navigation.push('SearchView', {
      query: markerQuery,
    });
  };

  return (
    <View style={styles.container}>
      <MarkerSet
        spotList={spotList}
        circleRadius={scale}
        region={region}
        navigation={navigation}
        onMarkerClicked={showMarkerDesc}
      />
      <View style={styles.currentLocationButton}>
        <Icon
          name="crosshairs-gps"
          size={icon.size}
          color={icon.color}
          onPress={() => updateCurrentLocation()}
        />
      </View>
      <View style={styles.fetchData}>
        <Icon
          name="update"
          size={icon.size}
          color={icon.color}
          onPress={() => fetchData()}
        />
      </View>
      <Slider
        style={styles.scaleBar}
        onValueChange={onValueChange}
        value={scale}
        minimumValue={RADIUS_MIN}
        maximumValue={RADIUS_MAX}
        minimumTrackTintColor={slider.color}
        maximumTrackTintColor={slider.backgroundColor}
      />
      {markerQuery.length > 0 && (
        <View style={styles.searchBar}>
          <Button title={markerQuery} onPress={searchMarker} />
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}