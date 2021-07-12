import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {RootStackParamList} from './Types';
import {StackScreenProps} from '@react-navigation/stack';
import {markerData} from './Interfaces';
import {getLocationData} from './Utils/LocationData';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  navigation: StackScreenProps<RootStackParamList, 'NotificationView'>;
}

export default function NotificationView({navigation}: Props) {
  const [scale, setScale] = useState<number>(500);
  const [notificationList, setNotificationList] = useState<markerData[]>([]);
  useEffect(() => {
    getLocationData().then(result => {
      if (!!result) setNotificationList(result);
    });
  }, []);

  const renderItem = ({item}: {item: markerData}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        navigation.navigate('Home', {
          notification: item,
        });
      }}>
      {!!item.firstimage && (
        <Image
          source={{
            uri: item.firstimage,
          }}
          style={styles.image}
          resizeMode="contain"
          onLoadEnd={() => console.log('Load Ended')}
        />
      )}
      {!item.firstimage && (
        <Icon
          name="image-off-outline"
          style={styles.icon}
          size={80}
          color="gray"
        />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.addr1}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 32, textAlign: 'center', padding: 10}}>
        알림 목록
      </Text>
      <FlatList
        data={notificationList}
        renderItem={renderItem}
        keyExtractor={item => item.title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  content: {
    position: 'absolute',
    top: 20,
    width: 200,
    left: 150,
    height: 100,
  },
  item: {
    backgroundColor: '#EFEFEF',
    padding: 20,
    height: 100,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
  },
  title: {
    fontSize: 20,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 20,
    borderRadius: 200,
    width: 100,
    height: 100,
  },
  icon: {
    position: 'absolute',
    top: 10,
    left: 30,
    borderRadius: 200,
    width: 100,
    height: 100,
  },
  body: {
    fontSize: 10,
  },
});
