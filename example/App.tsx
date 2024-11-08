import * as ExpoImageCompressor from "expo-image-compressor";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";

export function PhotoSelectionScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [compressed, setCompressed] = useState<string | null>(null);

  useEffect(() => {
    // Request permission to access photos on component mount
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need access to your photos to proceed."
        );
      }
    })();
  }, []);

  // Function to open the image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Set the selected image URI to state
    }
  };

  const compressImage = async () => {
    if (!image) return;
    const compressed = await ExpoImageCompressor.compress(
      image.replace("file:///", "/"),
      0.25
    );
    console.log("compressed", compressed);
  };

  useEffect(() => {
    const listen = ExpoImageCompressor.addChangeListener((val) => {
      if (val.status === "compressing" && val.fileSize) {
        console.log("fileSize initial", val.fileSize);
      } else if (val.status === "success") {
        setCompressed(`file://${val.data}`);
        console.log("fileSize final", val.fileSize);
      }
    });

    return () => listen.remove();
  }, [ExpoImageCompressor]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Select a Photo</Text>
      <Button title="Pick an image from gallery" onPress={pickImage} />

      {image && (
        <>
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200, marginTop: 20 }}
          />

          <Button title="Compress" onPress={compressImage} />
        </>
      )}

      {compressed && (
        <>
          <Image
            source={{ uri: compressed }}
            style={{ width: 200, height: 200, marginTop: 20 }}
          />
        </>
      )}
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <PhotoSelectionScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
