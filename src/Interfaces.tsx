import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from './Types';
import {Region} from 'react-native-maps';

export interface Response {
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

export interface markerData {
  addr1: string;
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

export interface RegionSize {
  latitudeDelta: number;
  longitudeDelta: number;
}
