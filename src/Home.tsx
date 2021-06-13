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
  Platform,
  Vibration,
} from 'react-native';
import * as Location from 'expo-location';
import { instance, instanceKor } from './Utils/HttpRequest'
import MarkerSet, { markerData } from './MarkerSet';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, SearchViewParams } from './Types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as TaskManager from 'expo-task-manager';
import { Notifications, NotificationBackgroundFetchResult } from 'react-native-notifications';

const LOCATION_TASK_NAME = 'background-location-task';
const TEST_TASK = 'test-task';

// TODO : tracking
// https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8
const API_KEY =
  'b3MDk9GG2y%2F7LTEc1SUKuzf0UFkIYt9WKGt7NPvzoNIEmgADmAgLtuMB2OXEnn9pPGi3geex6Nm22mzqUH6HPA%3D%3D';

Notifications.registerRemoteNotifications();

Notifications.events().registerNotificationReceivedForeground(
  (notification, completion) => {
    console.log(
      `Notification received in foreground: ${notification.title} : ${notification.body}`
    );
    completion({ alert: true, sound: false, badge: false });
  }
);

Notifications.events().registerNotificationReceivedBackground(
  (notification, completion) => {
    console.log(
      `Notification received in foreground: ${notification.title} : ${notification.body}`
    );
    completion(NotificationBackgroundFetchResult.NEW_DATA);
  }
);

Notifications.events().registerNotificationOpened(
  (notification, completion) => {
    console.log(`Notification opened: ${notification.payload}`);
    completion();
  }
);

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
}

const PATTERN_DESC =
  Platform.OS === 'android'
    ? 'wait 1s, vibrate 2s, wait 3s'
    : 'wait 1s, vibrate, wait 2s, vibrate, wait 3s';

const ONE_SECOND_IN_MS = 1000;

const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  3 * ONE_SECOND_IN_MS,
];

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  console.log('location Changed');
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.error(error);
    return;
  }
  if (data) {
    console.log(data);
    let localNotification = Notifications.postLocalNotification(
      {
        identifier: 'New location found!',
        payload: undefined,
        body: 'Local notification!',
        title: 'Local Notification Title',
        sound: 'chime.aiff',
        badge: 1,
        type: "",
        thread: ""
      },
      1
    );
    // do something with the locations captured in the background
  }
});

const startScheduler = async () => {
  const { status } = await Location.requestPermissionsAsync();
  console.log(status);
  if (status === 'granted') {
    console.log('start');
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      distanceInterval: 1000,
      timeInterval: 1000,
    });
  }
};

export default function Home({ navigation }: Props) {
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

  useEffect(() => {
    console.log("work only once !!!");
    updateCurrentLocation();
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
      setRegion({
        latitude: 37.568477,
        longitude: 126.981611,
        latitudeDelta: 0.01,
        longitudeDelta: 0.04,
      });
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
        setSpotList(response.data.response.body.items.item);
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
          size={30}
          color="#0070F8"
          onPress={() => updateCurrentLocation()}
        />
      </View>
      <View style={styles.fetchData}>
        <Icon
          name="update"
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
  currentLocationButton: {
    position: 'absolute',
    top: 50,
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
    top: 110,
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
    transform: [{ rotate: '270deg' }],
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
