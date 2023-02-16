import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
type Props = {
  children: React.ReactNode;
};
const AppContainer = (props: Props) => {
  return <NavigationContainer>{props.children}</NavigationContainer>;
};

export default AppContainer;
