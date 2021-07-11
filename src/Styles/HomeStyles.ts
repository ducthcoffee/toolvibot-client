import {
  StyleSheet,
  Dimensions
} from 'react-native';

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
  notification: {
    position: 'absolute',
    top: -10,
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
    transform: [{ rotate: '270deg' }],
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
  }
});

export const slider = {
  color: "#FFFFFF",
  backgroundColor: "#000000"
};

export const icon = {
  color: "#0070F8",
  size: 30
};

export default styles;