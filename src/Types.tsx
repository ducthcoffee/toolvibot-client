export type RootStackParamList = {
  Home: undefined;
  SearchView: SearchViewParams;
};

export type SearchViewParams = {
  query: string;
};

export type LocationData  = {
  locations: [
    spots :{
      coords: {
        latitude : number,
        longitude : number
      }
    }
  ]
}