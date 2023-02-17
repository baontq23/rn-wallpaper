import { Alert, Platform, StyleSheet, PermissionsAndroid } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ImageProps, RootStackParamList } from '@/nav/types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Box, Icon, Spinner } from 'native-base';
import ImageView from 'react-native-image-viewing';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import config from '@/config';
import { ImageSource } from 'react-native-image-viewing/dist/@types';
import { FloatingAction } from 'react-native-floating-action';

type Props = {
  route: NativeStackScreenProps<RootStackParamList, 'Preview'>['route'];
  navigation: NativeStackScreenProps<
    RootStackParamList,
    'Preview'
  >['navigation'];
};
const PreviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<ImageProps>(
    route.params.image
  );
  const [visible, setVisible] = useState<boolean>(true);
  const [images, setImages] = useState<ImageSource[]>(
    route.params.listImages?.map(item => ({ uri: item.url_o })) || []
  );
  const [currentImageIndex, setImageIndex] = useState<number>(
    route.params.currentIndex || 0
  );
  const [imagesData, setImagesData] = useState<ImageProps[]>(
    route.params.listImages || []
  );
  const handleReadAction = (imageSrc: ImageProps) => {
    const acts = [];
    if (imageSrc.url_k) {
      acts.push({
        text: imageSrc.height_k + ' x ' + imageSrc.width_k,
        icon: <Icon color="white" as={MaterialIcons} name="hd" size="sm" />,
        name: imageSrc.url_k
      });
    }
    if (imageSrc.url_3k) {
      acts.push({
        text: imageSrc.height_3k + ' x ' + imageSrc.width_3k,
        icon: <Icon color="white" as={MaterialIcons} name="3k" size="sm" />,
        name: imageSrc.url_3k
      });
    }
    if (imageSrc.url_4k) {
      acts.push({
        text: imageSrc.height_4k + ' x ' + imageSrc.width_4k,
        icon: <Icon color="white" as={MaterialIcons} name="4k" size="sm" />,
        name: imageSrc.url_4k
      });
    }
    acts.push({
      text: imageSrc.height_o + ' x ' + imageSrc.width_o,
      icon: <Icon color="white" as={MaterialIcons} name="5k" size="sm" />,
      name: imageSrc.url_o
    });
    return acts;
  };
  const [actions, setActions] = useState(handleReadAction(currentImage));

  const handleGetContext = () => {
    axios({
      baseURL: 'https://api.flickr.com/services/',
      url: `rest/?method=flickr.photosets.getContext&api_key=${
        config.FLICKR_APIKEY
      }&format=json&photo_id=${
        imagesData[imagesData.length - 1].id
      }&photoset_id=72157600030862687&nojsoncallback=1&extras=can_download,count_views,rotation,url_q,url_k,url_3k,url_4k,url_f,url_5k,url_6k,url_o`
    })
      .then(res => {
        const nextPhoto: ImageProps = res.data.nextphoto;
        console.log('Add image');

        setImagesData(preData => [...preData, { ...nextPhoto }]);
        setImages(preImages => [...preImages, { uri: nextPhoto.url_o }]);
      })
      .catch(e => {
        console.log(e);
        console.log('API error');
      });
  };

  const handleClose = () => {
    setVisible(false);
    navigation.goBack();
  };
  const handleSaveImage = async (uri: string) => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
            buttonPositive: 'OK'
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage Permission Granted.');
          setLoading(true);
          const date = new Date();
          const { config, fs } = RNFetchBlob;
          const PictureDir = fs.dirs.PictureDir;
          const options = {
            fileCache: true,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              path:
                PictureDir +
                '/image_' +
                Math.floor(date.getTime() + date.getSeconds() / 2) +
                '.' +
                uri.split('.').pop(),
              description: 'Image'
            }
          };
          config(options)
            .fetch('GET', uri)
            .then(res => {
              console.log('res -> ', JSON.stringify(res));
              Alert.alert('Info', 'Image Downloaded Successfully.');
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        console.warn(err);
        setLoading(false);
      }
    } else {
      setLoading(true);
      CameraRoll.save(uri, { type: 'photo' })
        .then(async res => {
          console.log(res);
          Alert.alert('Info', 'Image saved to photo library !');
        })
        .catch(e => {
          console.log(e);
          Alert.alert('Error', 'Please check application permission !');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <Box bgColor={'darkBgColor'} safeAreaTop style={styles.container}>
      <ImageView
        images={images}
        imageIndex={images.length === 0 ? 0 : currentImageIndex}
        visible={visible}
        onImageIndexChange={index => {
          setCurrentImage(imagesData[index]);
          setActions(handleReadAction(imagesData[index]));
          if (index === images.length - 1) {
            handleGetContext();
          }
          console.log(index + '/' + images.length);
        }}
        onRequestClose={handleClose}
        FooterComponent={() => (
          <Box>
            <FloatingAction
              actions={actions}
              distanceToEdge={10}
              onPressItem={url => handleSaveImage(url || '')}
              floatingIcon={
                isLoading ? (
                  <Spinner />
                ) : (
                  <Icon
                    color="white"
                    as={AntDesign}
                    name="download"
                    size="sm"
                  />
                )
              }
            />
          </Box>
        )}
      />
    </Box>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
