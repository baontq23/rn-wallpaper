import { Linking, StyleSheet } from 'react-native';
import React from 'react';
import { Box, Button, Icon, Text } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const AboutScreen = () => {
  return (
    <Box bgColor={'darkBgColor'} safeArea style={styles.container}>
      <Text bold>Bao Nguyen</Text>
      <Text>aka baontq23</Text>
      <Button
        onPress={() => Linking.openURL('https://github.com/baontq23')}
        leftIcon={
          <Icon name="github" as={MaterialCommunityIcons} color="white" />
        }
        colorScheme="blue"
      >
        Github
      </Button>
    </Box>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
