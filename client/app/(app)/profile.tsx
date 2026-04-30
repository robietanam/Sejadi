import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileScreen } from "../../src/screens/ProfileScreen";

export default function ProfilePage() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProfileScreen />
    </SafeAreaView>
  );
}
