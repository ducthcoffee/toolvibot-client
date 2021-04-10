import { Notifications, NotificationBackgroundFetchResult } from 'react-native-notifications';
import { instance, instanceKor } from './Utils/HttpRequest';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { includeLocationData, storeLocationData } from './Utils/LocationData';
import { markerData, Response } from './Interfaces';
import { API_KEY, DEFAULT_SCALE } from './Config';
import { LocationData } from './Types';

// TODO : tracking
// https://medium.com/quickon-code/react-native-location-tracking-14ab2c9e2db8
const LOCATION_TASK_NAME = 'background-location-task';

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

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  console.log('location Changed');
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.error(error);
    return;
  }
  if (data) {
    console.log(data);
    let locationData = data as LocationData;
    if(locationData?.locations) {
      console.log(locationData.locations[0].coords.longitude);
      console.log(locationData.locations[0].coords.latitude);
      const response =instanceKor
      .get(`/locationBasedList`, {
        params: {
          serviceKey: API_KEY,
          numOfRows: 10,
          pageNo: 1,
          MobileOS: 'ETC',
          MobileApp: 'AppTest',
          arrange: 'A',
          contentTypeId: 12,
          mapX: locationData.locations[0].coords.longitude,
          mapY: locationData.locations[0].coords.latitude,
          radius: DEFAULT_SCALE,
          listYN: 'Y',
        },
      })
      .then((response: Response) => {
        console.log(response);
        const markerSet : markerData[] = (response.data.response.body.items.item as markerData[]);
        if(!markerSet)
          return;
        markerSet.map(
          (value : markerData) => {
            includeLocationData(value)
            .then((included: boolean) => {
              if(!included){
                storeLocationData(value);
                NotifyNewSpots(value);
              }
            }).catch((e) => {
              console.error(e);
            });
        });
      })
      .catch((error: Error) => {
        console.error(error);
        console.error('cannot get markers');
      });
    }
  }
});

const NotifyNewSpots = (marker :markerData) => {
  Notifications.postLocalNotification(
    {
      identifier: 'New location found!',
      payload: undefined,
      body: marker.title,
      title: marker.title,
      sound: 'chime.aiff',
      badge: 1,
      type: "",
      thread: ""
    },
    1
  );
}

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

export default startScheduler;