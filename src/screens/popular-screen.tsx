import { StyleSheet } from 'react-native';
import React from 'react';
import { Box, Button, Text } from 'native-base';

const PopularScreen = () => {
  return (
    <Box bgColor={'darkBgColor'} safeArea style={styles.container}>
      <Text>PopularScreen</Text>
      <Button>Test</Button>
    </Box>
  );
};

export default PopularScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',

    alignItems: 'center'
  }
});
