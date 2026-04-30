import { SafeAreaView } from "react-native-safe-area-context";
import { SessionsScreen } from "../../src/screens/SessionsScreen";

export default function SessionsPage() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SessionsScreen />
    </SafeAreaView>
  );
}
