import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {Region} from 'react-native-maps';
import Slider from '@react-native-community/slider';
import {AppState, StyleSheet, View, Dimensions, Button} from 'react-native';
import * as Location from 'expo-location';
import {instanceKor} from './Utils/HttpRequest';
import MarkerSet, {markerData} from './MarkerSet';
import {StackScreenProps} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from './Types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import startScheduler, {NotificationCallback} from './Scheduler';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

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

interface Props {
  navigation: StackScreenProps<RootStackParamList, 'Home'>;
  route: RouteProp<RootStackParamList, 'Home'>;
}

startScheduler();

export default function Home({navigation, route}: Props) {
  const [region, setRegion] = useState<Region>({
    latitude: 30.568477,
    longitude: 126.981611,
    latitudeDelta: 0.01,
    longitudeDelta: 0.04,
  });
  const [errorMsg, setErrorMsg] = useState<String>('');
  const [scale, setScale] = useState<number>(500);
  const [spotList, setSpotList] = useState<markerData[]>([]);
  const [markerQuery, setMarkerQuery] = useState<string>('');
  const [notificationList, setNotificationList] = useState<any>([]);
  const [notification, setNotification] = useState<markerData | undefined>();

  useEffect(() => {
    const initialize = async () => {
      await updateCurrentLocation();
      await updateNotificationList();
      await NotificationCallback(setLocationToNotification);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (!!notification) setLocationToNotification(notification);
  }, [notification]);

  useEffect(() => {
    if (!!route.params) {
      setNotification(route.params.notification);
    }
  });

  const setLocationToNotification = (marker: markerData) => {
    console.log('mapx : ' + marker.mapx);
    console.log('mapy : ' + marker.mapy);
    setRegion({
      latitude: marker.mapy,
      longitude: marker.mapx,
      latitudeDelta: 0.01,
      longitudeDelta: 0.04,
    });
    setSpotList([marker]);
  };

  const updateCurrentLocation = async () => {
    console.log('updateCurrentLocation');
    try {
      //let {status} = await Location.requestPermissionsAsync();
      let statusFore = await (
        await Location.requestBackgroundPermissionsAsync()
      ).status;
      let statusBack = await (
        await Location.requestForegroundPermissionsAsync()
      ).status;
      if (statusFore !== 'granted' && statusBack !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (!!location) {
        if (!!region) {
          await setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
          });
        } else {
          await setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.04,
          });
        }
      } else {
        await setRegion({
          latitude: 37.568477,
          longitude: 126.981611,
          latitudeDelta: 0.01,
          longitudeDelta: 0.04,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = () => {
    console.log(region.longitude);
    console.log(region.latitude);
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
        if (!!response.data.response.body.items.item) {
          setSpotList(response.data.response.body.items.item);
        } else {
          alert('검색 결과가 없습니다!');
        }
      })
      .catch((error: Error) => {
        console.error(error.message);
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

  const showNotificationList = async () => {
    await PushNotification.cancelAllLocalNotifications();
    await PushNotificationIOS.setApplicationIconBadgeNumber(0);
    await PushNotification.getDeliveredNotifications(items => {
      setNotificationList(items);
    });
    navigation.push('NotificationView');
  };

  const updateNotificationList = () => {
    PushNotification.getDeliveredNotifications(items => {
      setNotificationList(items);
      PushNotificationIOS.setApplicationIconBadgeNumber(items.length);
    });
  };

  AppState.addEventListener('change', state => {
    if (state == 'active') {
      //updateCurrentLocation();
      updateNotificationList();
    }
  });

  return (
    <View style={styles.container}>
      <MarkerSet
        spotList={spotList}
        circleRadius={scale}
        region={region}
        navigation={navigation}
        onMarkerClicked={showMarkerDesc}
      />
      <View style={styles.notification}>
        <Icon
          name="bell-outline"
          size={30}
          color="#0070F8"
          onPress={async () => {
            //await setSpotList([]);
            showNotificationList();
          }}
        />
        <View style={styles.notificationAlert}>
          {notificationList.length > 0 && (
            <Icon name="checkbox-blank-circle" size={12} color="#0070F8" />
          )}
        </View>
      </View>
      <View style={styles.currentLocationButton}>
        <Icon
          name="crosshairs-gps"
          size={30}
          color="#0070F8"
          onPress={() => {
            updateCurrentLocation();
          }}
        />
      </View>
      <View style={styles.fetchData}>
        <Icon
          name="magnify"
          size={30}
          color="#0070F8"
          onPress={() => fetchData()}
        />
      </View>
      <Slider
        style={styles.scaleBar}
        onValueChange={onValueChange}
        value={scale}
        minimumValue={500}
        maximumValue={1800}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
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
  notification: {
    position: 'absolute',
    bottom: 260,
    right: 10,
    height: 50,
    width: 50,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderRadius: 15,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  notificationAlert: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 200,
    right: 10,
    height: 50,
    width: 50,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderRadius: 15,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  fetchData: {
    position: 'absolute',
    bottom: 140,
    right: 10,
    height: 50,
    width: 50,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderRadius: 15,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  scaleBar: {
    position: 'absolute',
    transform: [{rotate: '270deg'}],
    width: 200,
    height: 40,
    top: 150,
    left: -50,
  },
  searchBar: {
    width: '80%',
    height: 60,
    position: 'absolute',
    alignItems: 'center',
    bottom: 50,
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderRadius: 15,
    borderWidth: 0.5,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  input: {
    width: '60%',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
  },
});
