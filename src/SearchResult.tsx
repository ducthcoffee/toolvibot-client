import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const instance = axios.create({
  baseURL: 'https://openapi.naver.com/v1/search/',
  timeout: 3000,
  headers: {
    'X-Naver-Client-Id': 'ZyS76aFimM8jZMu31Oxp',
    'X-Naver-Client-Secret': 'A7dt6bZRcP',
    'Content-Type': 'text/json;charset=utf-8',
  },
});

interface searchForm {
  query: string;
}

interface Item {
  link: string;
  sizeheight: number;
  sizewidth: number;
  thumbnail: string;
  title: string;
}

const SearchResult = (props: searchForm) => {
  const [repos, setRepos] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await instance.get('/image', {
        params: {
          query: `${props.query}`,
          display: 40,
          start: 1,
          sort: 'sim',
        },
      });
      console.log(response.data.items);
      setRepos(response.data.items);
    };
    fetchData();
    console.log("get images");
    console.log(repos);
    console.log("get images end");
  }, [props]);

  useEffect(() => {
    for(const item of repos) {
      console.log(item.link);
    }
  },[repos]);

  return (
    <FlatList
      numColumns={3}
      keyExtractor={(item, index) => item.link}
      key={'h'}
      data={repos}
      renderItem={(itemData) => (
        <View style={styles.container} key={itemData.index}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: itemData.link,
            }}
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderColor: 'black',
  },
  tinyLogo: {
    width: 100,
    height: 100,
  },
  logo: {
    width: 66,
    height: 58,
  },
});

export default SearchResult;
