import { EventEmitter } from "expo-modules-core";

const emitter = new EventEmitter({} as any);

export default {
  async compress(value: string): Promise<void> {
    emitter.emit("onChange", { value });
  },
};
