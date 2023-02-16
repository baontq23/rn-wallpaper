import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
export type ImageProps = {
  id: string;
  secret: string;
  server: string;
  farm: number;
  title: string;
  isprimary: string;
  ispublic: number;
  isfriend: number;
  isfamily: number;
  rotation: number;
  count_views: string;
  can_download: number;
  url_q: string;
  height_q: 150;
  width_q: 150;
  url_k: string;
  height_k: number;
  width_k: number;
  url_3k: string;
  height_3k: number;
  width_3k: number;
  url_4k: string;
  height_4k: number;
  width_4k: number;
  url_o: string;
  height_o: number;
  width_o: number;
};
export type RootStackParamList = {
  Home: NavigatorScreenParams<HomeTabParamList>;
  Preview: { image: ImageProps };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type HomeTabParamList = {
  Popular: undefined;
  About: undefined;
};

export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
