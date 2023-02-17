import { Alert, StyleSheet, TouchableHighlight } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Heading,
  HStack,
  Icon,
  Image,
  Spinner,
  Text,
  View
} from 'native-base';
import { FlatGrid } from 'react-native-super-grid';
import axios from 'axios';
import config from '@/config';
import { ImageProps, RootStackParamList } from '@/nav/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
type Props = {
  navigation: NativeStackScreenProps<RootStackParamList, 'Home'>['navigation'];
};
const PopularScreen = ({ navigation }: Props) => {
  const [page, setPage] = useState<number>(1);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [perPage, setPerPage] = useState<number>(10);
  const [data, setData] = useState<ImageProps[]>([]);
  const handleReload = useCallback(() => {
    setData([]);
    setPage(1);
    setPerPage(10);
    handleLoadItems();
  }, []);
  useEffect(() => {
    handleLoadItems();
  }, []);

  const handleLoadItems = useCallback(() => {
    setPage(prePage => prePage + 1);
    setLoading(true);
    axios({
      baseURL: 'https://api.flickr.com/services',
      url: `/rest/?method=flickr.photosets.getPhotos&api_key=${config.FLICKR_APIKEY}&format=json&photoset_id=72157600030862687&extras=can_download,count_views,rotation,url_q,url_k,url_3k,url_4k,url_f,url_5k,url_6k,url_o&privacy_filter=1&media=photos&per_page=${perPage}&page=${page}&nojsoncallback=1`
    })
      .then(res => {
        setData(preData => [...preData, ...res.data.photoset.photo]);
      })
      .catch(e => {
        console.log(e);
        Alert.alert('Network error!');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, perPage]);
  return (
    <Box bgColor={'darkBgColor'} safeAreaTop flex={1}>
      <FlatGrid
        onEndReached={handleLoadItems}
        itemDimension={130}
        data={data}
        refreshing={isLoading}
        keyExtractor={item => item.id}
        onRefresh={handleReload}
        style={styles.gridView}
        spacing={10}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <TouchableHighlight
              onPress={() =>
                navigation.navigate('Preview', {
                  image: item,
                  listImages: data,
                  currentIndex: index
                })
              }
            >
              <Image
                src={item.url_q}
                alt="Image"
                style={styles.itemContainer}
              />
            </TouchableHighlight>
            <HStack p={2} space={1} style={styles.itemName}>
              <Icon
                name="eye-outline"
                as={MaterialCommunityIcons}
                color={'warmGray.100'}
                size="md"
              />
              <Text
                style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.75)',
                  textShadowOffset: { width: -1, height: 1 },
                  textShadowRadius: 10
                }}
                bold
              >
                {item.count_views}
              </Text>
            </HStack>
          </View>
        )}
        ListFooterComponent={
          isLoading ? (
            <HStack space={2} justifyContent="center">
              <Spinner />
              <Heading color="primary.500" fontSize="md">
                Loading
              </Heading>
            </HStack>
          ) : null
        }
      />
    </Box>
  );
};

export default PopularScreen;

const styles = StyleSheet.create({
  gridView: {
    flex: 1
  },
  itemContainer: {
    position: 'relative',
    borderRadius: 5,
    height: 150,
    justifyContent: 'flex-end'
  },
  itemName: {
    position: 'absolute'
  }
});
