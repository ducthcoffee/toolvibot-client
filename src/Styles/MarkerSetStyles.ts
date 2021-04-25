import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

export const styles = StyleSheet.create({
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