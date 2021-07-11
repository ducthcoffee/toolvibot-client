import {markerData} from './Interfaces';

export type RootStackParamList = {
  Home: HomeViewParams;
  SearchView: SearchViewParams;
  NotificationView: undefined;
};

export type SearchViewParams = {
  query: string;
};

export type HomeViewParams = {
  notification: markerData;
};

export type LocationData = {
  locations: [
    spots: {
      coords: {
        latitude: number;
        longitude: number;
      };
    },
  ];
};
