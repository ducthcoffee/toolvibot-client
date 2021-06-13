import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import SearchResult from './SearchResult';
import { RootStackParamList, SearchViewParams } from './Types';
import { RouteProp } from '@react-navigation/native';

interface Props {
  route: RouteProp<RootStackParamList, 'SearchView'>;
}

export default function SearchView({ route }: Props) {
  const [tempText, setTempText] = useState<string>(route.params.query);
  const [searchText, setSearchText] = useState<string>(route.params.query);
  const [imageList, setImageList] = useState<any>([]);

  const searchInputHandler = (enteredText: string) => {
    setTempText(enteredText);
  };

  const doSearch = () => {
    //console.log(searchText);
    setSearchText(tempText);
    setTempText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.searchText}>{searchText}</Text>
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
  searchText: {
    fontSize: 24,
    top: 80,
    textAlign: 'center',
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
