import AsyncStorage from '@react-native-async-storage/async-storage';
import { markerData } from './MarkerSet';

export const storeLocationData = async (value : markerData) : Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(value);
    const included : boolean = await includeLocationData(value);
    if(included)
      return false;
    await AsyncStorage.setItem(value.title, jsonValue);
    return true;
  } catch (e) {
    // saving error
  }
}

export const includeLocationData = async (value : markerData) : Promise<boolean> => {
  try {
    const jsonValue = await AsyncStorage.getItem(value.title);
    if (jsonValue == null)
      return false;
    else
      return true;
  } catch(e) {
    // error reading value
  }
}

export const clearLocationData = async  ()  => {
  AsyncStorage.clear();
}