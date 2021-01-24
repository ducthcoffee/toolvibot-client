import { Notifications, NotificationBackgroundFetchResult } from 'react-native-notifications';
import Platform from "react-native";
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

// TODO : tracking
// https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8

const PATTERN_DESC =
  Platform.OS === 'android'
    ? 'wait 1s, vibrate 2s, wait 3s'
    : 'wait 1s, vibrate, wait 2s, vibrate, wait 3s';

const ONE_SECOND_IN_MS = 1000;
const LOCATION_TASK_NAME = 'background-location-task';
const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  3 * ONE_SECOND_IN_MS,
];

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

export default startScheduler;