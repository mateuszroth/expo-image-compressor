import { StyleSheet, Text, View } from 'react-native';

import * as ExpoImageCompressor from 'expo-image-compressor';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoImageCompressor.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
