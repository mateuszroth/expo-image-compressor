import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoImageCompressorViewProps } from './ExpoImageCompressor.types';

const NativeView: React.ComponentType<ExpoImageCompressorViewProps> =
  requireNativeViewManager('ExpoImageCompressor');

export default function ExpoImageCompressorView(props: ExpoImageCompressorViewProps) {
  return <NativeView {...props} />;
}
