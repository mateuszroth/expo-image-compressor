# expo-image-compressor

Minify photos with simple API

# Attention! Version 0.1.0 works only with iOS

# Usage

Check example project in project's repository:

1. Call the `compress` method:
```js
const compressed = await ExpoImageCompressor.compress(
  imagePath,
  0.25
);
```
2. Listen for events:
```js
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
  ```

# API documentation

- [Documentation for the main branch](https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/image-compressor.md)
- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/image-compressor/)

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install expo-image-compressor
```

### Configure for iOS

Run `npx pod-install` after installing the npm package.


### Configure for Android



# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide]( https://github.com/expo/expo#contributing).
