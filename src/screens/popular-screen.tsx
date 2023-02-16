import { Alert, StyleSheet, TouchableHighlight } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Box, Heading, HStack, Image, Spinner, View } from 'native-base';
import { FlatGrid } from 'react-native-super-grid';
import axios from 'axios';
import config from '@/config';
import { ImageProps, RootStackParamList } from '@/nav/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
type Props = {
  navigation: NativeStackScreenProps<RootStackParamList, 'Home'>['navigation'];
};
const PopularScreen = ({ navigation }: Props) => {
  const [page, setPage] = useState<number>(1);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [perPage, setPerPage] = useState<number>(10);
  const [items, setItems] = React.useState([
    { name: 'TURQUOISE', code: '#1abc9c' },
    { name: 'EMERALD', code: '#2ecc71' },
    { name: 'PETER RIVER', code: '#3498db' },
    { name: 'AMETHYST', code: '#9b59b6' },
    { name: 'WET ASPHALT', code: '#34495e' },
    { name: 'GREEN SEA', code: '#16a085' },
    { name: 'NEPHRITIS', code: '#27ae60' },
    { name: 'BELIZE HOLE', code: '#2980b9' },
    { name: 'WISTERIA', code: '#8e44ad' },
    { name: 'MIDNIGHT BLUE', code: '#2c3e50' },
    { name: 'SUN FLOWER', code: '#f1c40f' },
    { name: 'CARROT', code: '#e67e22' },
    { name: 'ALIZARIN', code: '#e74c3c' },
    { name: 'CLOUDS', code: '#ecf0f1' },
    { name: 'CONCRETE', code: '#95a5a6' },
    { name: 'ORANGE', code: '#f39c12' },
    { name: 'PUMPKIN', code: '#d35400' },
    { name: 'POMEGRANATE', code: '#c0392b' },
    { name: 'SILVER', code: '#bdc3c7' },
    { name: 'ASBESTOS', code: '#7f8c8d' }
  ]);
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
  }, [page, perPage, items]);
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
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableHighlight
              onPress={() => navigation.navigate('Preview', { image: item })}
            >
              <Image
                src={item.url_q}
                alt="Image"
                style={styles.itemContainer}
              />
            </TouchableHighlight>
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
    justifyContent: 'flex-end',
    borderRadius: 5,
    height: 150
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff'
  }
});
