import { runOnJS } from "react-native-reanimated";

export const runSafely = async (callback: () => void, delay: number = 50) => {
  try {
    if (runOnJS) {
      runOnJS(callback)();
    } else {
      setTimeout(callback, delay);
    }
  } catch (e) {
    setTimeout(callback, delay);
  }
};
