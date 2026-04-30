import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterScreen } from "../../src/screens/RegisterScreen";

export default function RegisterPage() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RegisterScreen />
    </SafeAreaView>
  );
}
