import React from 'react';
import AppContainer from '@/components/app-container';
import AppStack from '@/nav/app-stack';
import { StatusBar } from 'native-base';

const App = () => {
  return (
    <AppContainer>
      <StatusBar barStyle={'light-content'} />
      <AppStack />
    </AppContainer>
  );
};

export default App;
