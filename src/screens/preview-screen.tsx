import { Alert, Platform, StyleSheet, PermissionsAndroid } from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/nav/types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  Actionsheet,
  Box,
  Fab,
  HStack,
  Icon,
  Image,
  Text,
  useDisclose
} from 'native-base';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFetchBlob from 'rn-fetch-blob';
type Props = {
  route: NativeStackScreenProps<RootStackParamList, 'Preview'>['route'];
};
const PreviewScreen: React.FC<Props> = ({ route }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const image = route.params.image;
  const { isOpen, onClose, onOpen, onToggle } = useDisclose();

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
          onToggle();
          setLoading(false);
        });
    }
  };
  return (
    <Box bgColor={'darkBgColor'} safeAreaTop style={styles.container}>
      <Image src={image.url_o} alt="" flex={1} resizeMode="contain" />
      <Actionsheet isOpen={isOpen} onClose={onClose} size={'full'}>
        <Actionsheet.Content>
          <HStack w="100%" h={60} px={4} alignItems={'center'}>
            <Icon
              mr={5}
              color="white"
              as={AntDesign}
              name="download"
              size="sm"
            />
            <Text bold fontSize="16" color="gray.300">
              Download option
            </Text>
          </HStack>
          <Actionsheet.Item
            isLoading={isLoading}
            onPress={() => handleSaveImage(image.url_k)}
          >
            {image.height_k + ' x ' + image.width_k}
          </Actionsheet.Item>
          <Actionsheet.Item
            isLoading={isLoading}
            onPress={() => handleSaveImage(image.url_3k)}
          >
            {image.height_3k + ' x ' + image.width_3k}
          </Actionsheet.Item>
          <Actionsheet.Item
            isLoading={isLoading}
            onPress={() => handleSaveImage(image.url_4k)}
          >
            {image.height_4k + ' x ' + image.width_4k}
          </Actionsheet.Item>
          <Actionsheet.Item
            isLoading={isLoading}
            onPress={() => handleSaveImage(image.url_o)}
          >
            {image.height_o + ' x ' + image.width_o + ' (Original quality)'}
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>

      {!isOpen && (
        <Fab
          onPress={onOpen}
          shadow={2}
          size="sm"
          icon={<Icon color="white" as={AntDesign} name="download" size="sm" />}
        />
      )}
    </Box>
  );
};

export default PreviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
