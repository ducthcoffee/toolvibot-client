import {instance, instanceKor} from './Utils/HttpRequest';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import {includeLocationData, storeLocationData} from './Utils/LocationData';
import {markerData, Response} from './Interfaces';
import {API_KEY, DEFAULT_SCALE} from './Config';
import {LocationData} from './Types';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, {Importance} from 'react-native-push-notification';
import Platform from 'react-native';

export const NotificationCallback = (
  callback: (marker: markerData) => void,
) => {
  // Must be outside of any component LifeCycle (such as `componentDidMount`).
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log('TOKEN:', token);
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
      callback(notification.data as markerData);
      // process the notification

      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);

      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
      console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });
};

// TODO : tracking
// https://medium.com/quickon-code/react-native-location-tracking-14ab2c9e2db8
const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({data, error}) => {
  console.log('location Changed');
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.error(error);
    return;
  }
  if (data) {
    //console.log(data);
    let locationData = data as LocationData;
    if (locationData?.locations) {
      //console.log(locationData.locations[0].coords.longitude);
      //console.log(locationData.locations[0].coords.latitude);
      const response = instanceKor
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
          //console.log(response);
          const markerSet: markerData[] = response.data.response.body.items
            .item as markerData[];
          if (!markerSet) return;
          markerSet?.map((value: markerData) => {
            includeLocationData(value)
              .then((included: boolean) => {
                if (!included) {
                  NotifyNewSpots(value);
                  storeLocationData(value);
                }
              })
              .catch(e => {
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

let id = 0;
const NotifyNewSpots = (marker: markerData) => {
  console.log('Notify!');
  PushNotification.localNotification({
    channelId: 'toolvibot',
    /* Android Only Properties */
    vibrate: true,
    vibration: 300,
    //priority: 'hight',
    visibility: 'public',
    //importance: 'hight',

    /* iOS and Android properties */
    title: marker.title, // (optional)
    message: marker.addr1, // (required)
    playSound: false,
    number: id,
    userInfo: marker,
    // for production
    //repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    //date: new Date(Date.now()),

    // test to trigger each miniute
    // repeatType: 'minute',
    // date: new Date(Date.now()),

    // test to trigger one time
    // date: new Date(Date.now() + 20 * 1000),
  });
  id++;
};

const startScheduler = async () => {
  const {status} = await Location.requestBackgroundPermissionsAsync();
  if (status === 'granted') {
    console.log('start Scheduler');
    try {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 1000,
        timeInterval: 0,
        //showsBackgroundLocationIndicator: true,
        pausesUpdatesAutomatically: false,
        foregroundService: {
          notificationTitle: 'toolvibot',
          notificationBody: 'new location found',
        },
        activityType: Location.LocationActivityType.AutomotiveNavigation,
      });
      console.log(`OS : ${Platform.OS}`);

      if (Platform.OS !== 'ios') {
        PushNotification.createChannel(
          {
            channelId: 'toolvibot', // (required)
            channelName: 'toolvibot', // (required)
            soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
            importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
          },
          created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
};

export default startScheduler;
