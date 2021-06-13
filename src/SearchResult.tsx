import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, ImageBackground } from 'react-native';

const loadingImage = require('../assets/loading.gif')

const REQUEST_IMAGE_COUNT = 40;

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
  const [repos, setRepos] = useState<Array<Item>>([]);
  const [startImageIndex, setStartImageIndex] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Item>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await instance.get('/image', {
        params: {
          query: `${props.query}`,
          display: REQUEST_IMAGE_COUNT,
          start: startImageIndex,
          sort: 'sim',
        },
      });
      console.log(response.data.items);
      setRepos(response.data.items);
      setStartImageIndex(REQUEST_IMAGE_COUNT + startImageIndex);
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
    <View>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
            >
          {currentItem &&
            <ImageBackground source={loadingImage} style={styles.full}>
            <Image
              source={{
                uri:currentItem.link
              }}
              style={styles.full}
              resizeMode="contain"
            />
            </ImageBackground>
          }
          </TouchableOpacity>
          </View>
        </View>
      </Modal>
    <FlatList
      numColumns={3}
      keyExtractor={(item, index) => item.link}
      key={'h'}
      data={repos}
      onEndReached={
        (info: {distanceFromEnd: number}) : void => {
          const fetchData = async () => {
            const response = await instance.get('/image', {
              params: {
                query: `${props.query}`,
                display: REQUEST_IMAGE_COUNT,
                start: startImageIndex,
                sort: 'sim',
              },
            });
            console.log(response.data.items);
            setRepos([...repos, ...response.data.items]);
            setStartImageIndex(REQUEST_IMAGE_COUNT + startImageIndex);
          };
          fetchData();
        }
      }
      renderItem={(itemData) => (
        <View style={styles.container} key={itemData.index}>
          <TouchableOpacity
            onPress={ () : void =>{
              setCurrentItem(itemData.item);
              setModalVisible(!modalVisible);
              console.log(itemData)
            }}
          >
            <Image
              style={styles.tinyLogo}
              source={{
                uri: itemData.item.thumbnail,
              }}
            />
          </TouchableOpacity>
        </View>
      )}
    />
    </View>
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
  full: {
    width:500,
    height:500
  },
  modalView: {
    backgroundColor: "white",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default SearchResult;
