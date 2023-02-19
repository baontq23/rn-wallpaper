import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { extendTheme, NativeBaseProvider } from 'native-base';
type Props = {
  children: React.ReactNode;
};
const AppContainer = (props: Props) => {
  const theme = extendTheme({
    colors: {
      bottomBg: '#151515',
      darkBgColor: '#010101'
    },
    config: {
      initialColorMode: 'dark'
    }
  });
  return (
    <NavigationContainer>
      <NativeBaseProvider theme={theme}>{props.children}</NativeBaseProvider>
    </NavigationContainer>
  );
};

export default AppContainer;
