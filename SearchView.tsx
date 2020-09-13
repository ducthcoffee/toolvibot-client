import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import SearchResult from './SearchResult';

export default function App() {
  const [tempText, setTempText] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [imageList, setImageList] = useState<any>([]);

  const searchInputHandler = (enteredText: string) => {
    setTempText(enteredText);
  };

  const doSearch = () => {
    setSearchText(tempText);
    setTempText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search"
          style={styles.input}
          onChangeText={searchInputHandler}
        />
        <View style={styles.button}>
          <Button title="Enter" onPress={doSearch} />
        </View>
      </View>
      <View style={styles.searchResult}>
        <SearchResult query={searchText} />
      </View>
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
  searchBar: {
    flexDirection: 'row',
    width: '80%',
    position: 'absolute',
    alignItems: 'center',
    top: 50,
  },
  input: {
    width: '60%',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
  },
  button: {
    width: '20%',
  },
  searchResult: {
    top: 100,
  },
});
