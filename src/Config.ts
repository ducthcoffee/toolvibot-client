import Platform from "react-native";
import { Region } from 'react-native-maps';

export const API_KEY = 'b3MDk9GG2y%2F7LTEc1SUKuzf0UFkIYt9WKGt7NPvzoNIEmgADmAgLtuMB2OXEnn9pPGi3geex6Nm22mzqUH6HPA%3D%3D';

//@NOTE : needed for vibration alert

/*const PATTERN_DESC =
  Platform.OS === 'android'
    ? 'wait 1s, vibrate 2s, wait 3s'
    : 'wait 1s, vibrate, wait 2s, vibrate, wait 3s';

const ONE_SECOND_IN_MS = 1000;

const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  2 * ONE_SECOND_IN_MS,
  3 * ONE_SECOND_IN_MS,
];*/

export const DEFAULT_SCALE : number = 500;

export const DEFAULT_LOCATIOIN : Region = {
  latitude: 37.568477,
  longitude: 126.981611,
  latitudeDelta: 0.01,
  longitudeDelta: 0.04,
};

export const RADIUS_MIN = 500;
export const RADIUS_MAX = 1800;