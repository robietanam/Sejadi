import { SafeAreaView } from "react-native-safe-area-context";
import { HomeScreen } from "../../src/screens/HomeScreen";

export default function HomePage() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HomeScreen />
    </SafeAreaView>
  );
}
