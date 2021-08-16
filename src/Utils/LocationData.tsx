import AsyncStorage from '@react-native-async-storage/async-storage';
import {markerData} from '../Interfaces';

export const storeLocationData = async (
  value: markerData,
): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(value);
    const included: boolean = await includeLocationData(value);
    if (included) return false;
    await AsyncStorage.setItem(value.title, jsonValue);
    return true;
  } catch (e) {
    // saving error
  }
};

export const includeLocationData = async (
  value: markerData,
): Promise<boolean> => {
  try {
    const jsonValue = await AsyncStorage.getItem(value.title);
    if (jsonValue == null) return false;
    else return true;
  } catch (e) {
    // error reading value
  }
};

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export const getLocationData = async () => {
  try {
    const jsonValue = await AsyncStorage.getAllKeys();
    const values = await Promise.all(
      jsonValue.map(async key => {
        const value = await AsyncStorage.getItem(key);
        return value;
      }),
    );
    const result = values
      .map(value => {
        if (!!value) return JSON.parse(value) as markerData;
      })
      .filter(notEmpty);
    return result;
  } catch (e) {
    // error reading value
  }
};

export const clearLocationData = async () => {
  AsyncStorage.clear();
};
