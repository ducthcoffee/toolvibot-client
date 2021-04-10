import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { naverAPI } from './Utils/HttpRequest';

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
  const [repos, setRepos] = useState<Array<Item>>([
    {
      link: "test",
      sizeheight: 10,
      sizewidth: 10,
      thumbnail: "sefaef",
      title: "test"
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await naverAPI.get('/image', {
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
            uri: itemData.item.link,
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
