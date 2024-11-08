import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to ExpoImageCompressor.web.ts
// and on native platforms to ExpoImageCompressor.ts
import ExpoImageCompressorModule from "./ExpoImageCompressorModule";
import ExpoImageCompressorView from "./ExpoImageCompressorView";
import {
  ChangeEventPayload,
  ExpoImageCompressorViewProps,
} from "./ExpoImageCompressor.types";

// Get the native constant value.
// export const PI = ExpoImageCompressorModule.PI;

// export function hello(): string {
//   return ExpoImageCompressorModule.hello();
// }

export async function compress(
  value: string,
  quality: 0 | 0.25 | 0.5 | 0.75 | 1
) {
  return await ExpoImageCompressorModule.compress(value, quality);
}

const emitter = new EventEmitter(
  ExpoImageCompressorModule ?? NativeModulesProxy.ExpoImageCompressor
);

export function addChangeListener(
  listener: (event: ChangeEventPayload) => void
): Subscription {
  return emitter.addListener<ChangeEventPayload>("onChange", listener);
}

export {
  ExpoImageCompressorView,
  ExpoImageCompressorViewProps,
  ChangeEventPayload,
};
