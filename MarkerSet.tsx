import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import MapView, { Marker, Circle, Region, Callout } from 'react-native-maps';
import SearchResult from './SearchResult';
import { Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './Types';

export interface markerData {
  //addr1: '20-1, Samil-daero 8-gil, Jung-gu, Seoul';
  //areacode: 1;
  //cat1: 'A02';
  //cat2: 'A0203';
  //cat3: 'A02030400';
  //contentid: 2590011;
  //contenttypeid: 76;
  //createdtime: 20190211130745;
  //dist: 991;
  firstimage: string;
  //firstimage2: 'http://tong.visitkorea.or.kr/cms/resource/90/2589890_image2_1.bmp';
  mapx: number;
  mapy: number;
  //masterid: 2589895;
  //mlevel: 6;
  //modifiedtime: 20190211145913;
  //readcount: 1424;
  //sigungucode: 24;
  //tel: '+82-10-8895-3368';
  title: string;
}

interface MarkerSetProps {
  spotList: markerData[];
  circleRadius: number;
  region: Region;
  navigation: StackScreenProps<RootStackParamList, 'Home'>;
}

interface RegionSize {
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function MarkerSet(props: MarkerSetProps) {
  const markerList = props.spotList;
  const mapRef = useRef<MapView>(null);
  const [regionSize, setRegionSize] = useState<RegionSize>({
    latitudeDelta: 10,
    longitudeDelta: 0.04,
  });

  useEffect(() => {
    if (mapRef.current && props.region) {
      const newRegion: Region = {
        latitude: props.region.latitude,
        longitude: props.region.longitude,
        latitudeDelta: regionSize.latitudeDelta,
        longitudeDelta: regionSize.longitudeDelta,
      };
      mapRef.current.animateToRegion(newRegion);
    }
  }, [props.region]);

  return (
    <View>
      <MapView
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChange={(region: Region) => {
          setRegionSize({
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
          });
        }}
        style={styles.mapStyle}
        ref={mapRef}
      >
        <Circle
          center={{
            latitude: props.region ? props.region.latitude : 37,
            longitude: props.region ? props.region.longitude : -122,
          }}
          radius={props.circleRadius}
          strokeColor={'#000'}
        />
        {markerList.map((marker: markerData) => (
          <Marker
            coordinate={{
              latitude: marker.mapy * 1,
              longitude: marker.mapx * 1,
            }}
            key={marker.title}
            onPress={() => {
              console.log('Clicked');
              /*props.navigation.push('SearchView', {
                query: marker.title,
              });*/
            }}
            title={marker.title}
            description={marker.title}
          >
            <Callout>
              <Text>{marker.title}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>
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
  },
  fetchData: {
    position: 'absolute',
    top: 120,
    right: 10,
  },
  scaleBar: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
    width: 200,
    height: 40,
    top: 150,
    left: -50,
  },
  searchBar: {
    width: '80%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 50,
  },
  markerDesc: {
    height: '30%',
    width: '80%',
    position: 'absolute',
    bottom: 0,
  },
  input: {
    width: '60%',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
  },
});
