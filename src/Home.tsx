import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {Region} from 'react-native-maps';
import Slider from '@react-native-community/slider';
import {AppState, StyleSheet, View, Dimensions, Button} from 'react-native';
import * as Location from 'expo-location';
import {instanceKor} from './Utils/HttpRequest';
import MarkerSet, {markerData} from './MarkerSet';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from './Types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import startScheduler from './Scheduler';

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
}

startScheduler();

export default function Home({navigation}: Props) {
  const [region, setRegion] = useState<Region>({
    latitude: 30.568477,
    longitude: 126.981611,
    latitudeDelta: 0.01,
    longitudeDelta: 0.04,
  });
  const [trackFlag, setTrackFlag] = useState<boolean>(false);
  const [trackTask, setTrackTask] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<String>('');
  const [scale, setScale] = useState<number>(500);
  const [spotList, setSpotList] = useState<markerData[]>([]);
  const [markerQuery, setMarkerQuery] = useState<string>('');

  useEffect(() => {
    console.log('work only once !!!');
    updateCurrentLocation();
  }, []);

  const updateCurrentLocation = async () => {
    try {
      let {status} = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
      let location = await Location.getCurrentPositionAsync({});
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

  AppState.addEventListener('change', state => {
    if (state == 'active') {
      updateCurrentLocation();
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
