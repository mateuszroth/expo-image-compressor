import * as React from 'react';

import { ExpoImageCompressorViewProps } from './ExpoImageCompressor.types';

export default function ExpoImageCompressorView(props: ExpoImageCompressorViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
